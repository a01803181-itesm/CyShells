package handlers

import (
	"context"
	"cyshells-api/internal/models"
	"time"

	"github.com/danielgtaylor/huma/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetDashboardTable(db *mongo.Database) func(context.Context, *models.TableInput) (*models.TableOutput, error) {
	return func(ctx context.Context, input *models.TableInput) (*models.TableOutput, error) {
		timeoutCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
		defer cancel()

		collection := db.Collection("tiktoks")

		filter := bson.M{}
		if input.Search != "" {
			filter["$or"] = []bson.M{
				{"user.username": primitive.Regex{Pattern: input.Search, Options: "i"}},
				{"description": primitive.Regex{Pattern: input.Search, Options: "i"}},
			}
		}
		if input.Risk != "" {
			filter["omega_analysis.threat_level"] = input.Risk
		}

		total, err := collection.CountDocuments(timeoutCtx, filter)
		if err != nil {
			return nil, huma.Error500InternalServerError("Failed to count documents", err)
		}

		skip := int64((input.Page - 1) * input.Limit)
		findOptions := options.Find().
			SetSort(bson.D{{Key: "scraped_at", Value: -1}}).
			SetSkip(skip).
			SetLimit(int64(input.Limit))

		cursor, err := collection.Find(timeoutCtx, filter, findOptions)
		if err != nil {
			return nil, huma.Error500InternalServerError("Failed to query database", err)
		}
		defer cursor.Close(timeoutCtx)

		var rawDocs []models.TikTok
		if err = cursor.All(timeoutCtx, &rawDocs); err != nil {
			return nil, huma.Error500InternalServerError("Failed to decode table results", err)
		}

		var tableData []models.TableRow
		for _, doc := range rawDocs {
			avatar := ""
			if doc.User.AvatarURL != nil {
				avatar = *doc.User.AvatarURL
			}

			desc := ""
			if doc.Description != nil {
				desc = *doc.Description
			}

			risk := "PENDIENTE"
			if doc.OmegaAnalysis != nil {
				risk = doc.OmegaAnalysis.ThreatLevel
			}

			tableData = append(tableData, models.TableRow{
				VideoID:     doc.ID,
				Username:    doc.User.Username,
				AvatarURL:   avatar,
				Description: desc,
				Plays:       doc.PlaysCount,
				Likes:       doc.DiggsCount,
				RiskLevel:   risk,
				ScrapedAt:   doc.ScrapedAt,
			})
		}

		if tableData == nil {
			tableData = []models.TableRow{}
		}

		uiPayload := models.TableResponse{
			Total: total,
			Page: input.Page,
			Limit: input.Limit,
			Data: tableData,
		}

		return &models.TableOutput{Body: uiPayload}, nil
	}
}