package handlers

import (
	"context"
	"cyshells-api/internal/models"
	"time"

	"github.com/danielgtaylor/huma/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetOmegaImages(db *mongo.Database) func(context.Context, *models.GalleryInput) (*models.GalleryOutput, error) {
	return func(ctx context.Context, input *models.GalleryInput) (*models.GalleryOutput, error) {
		timeoutCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
		defer cancel()

		collection := db.Collection("tiktoks")

		filter := bson.M{
			"omega_analysis": bson.M{"$exists": true},
			"omega_analysis.public_uri": bson.M{"$ne": nil},
		}

		if input.Risk != "" && input.Risk != "TODOS" {
			filter["omega_analysis.threat_level"] = input.Risk
		}

		findOptions := options.Find().
			SetSort(bson.D{{Key: "scraped_at", Value: -1}}).
			SetLimit(int64(input.Limit))

		cursor, err := collection.Find(timeoutCtx, filter, findOptions)
		if err != nil {
			return nil, huma.Error500InternalServerError("Failed to query database for gallery", err)
		}

		defer cursor.Close(timeoutCtx)

		var rawDocs []models.TikTok
		if err = cursor.All(timeoutCtx, &rawDocs); err != nil {
			return nil, huma.Error500InternalServerError("Failed to decode gallery results", err)
		}

		var galleryData []models.GalleryCard
		for _, doc := range rawDocs {
			var flatLabels []string
			if doc.OmegaAnalysis != nil && doc.OmegaAnalysis.RisksLabels != nil {
				for _, labels := range doc.OmegaAnalysis.RisksLabels {
					flatLabels = append(flatLabels, labels...)
				}
			}

			imageURI := ""
			if doc.OmegaAnalysis != nil && doc.OmegaAnalysis.PublicURI != nil {
				imageURI = *doc.OmegaAnalysis.PublicURI
			}

			galleryData = append(galleryData, models.GalleryCard{
				ID: doc.ID,
				User: "@" + doc.User.Username,
				Risk: doc.OmegaAnalysis.ThreatLevel,
				Labels: flatLabels,
				Image: imageURI,
			})
		}

		if galleryData == nil {
			galleryData = []models.GalleryCard{}
		}

		return &models.GalleryOutput{
			Body: models.GalleryResponse{Data: galleryData},
		}, nil
	}
}