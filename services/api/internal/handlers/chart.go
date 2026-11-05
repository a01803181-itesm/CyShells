package handlers

import (
	"context"
	"cyshells-api/internal/models"
	"time"

	"github.com/danielgtaylor/huma/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func GetDashboardCharts(db *mongo.Database) func(context.Context, *struct{}) (*models.ChartOutput, error) {
	return func(ctx context.Context, input *struct{}) (*models.ChartOutput, error) {
		timeoutCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
		defer cancel()
		collection := db.Collection("tiktoks")

		pipeline := mongo.Pipeline{
			{{Key: "$facet", Value: bson.D{
				{Key: "top_accounts", Value: bson.A{
					bson.D{{Key: "$group", Value: bson.D{
						{Key: "_id", Value: "$user.username"},
						{Key: "followers", Value: bson.D{{Key: "$max", Value: "$user.followers"}}},
					}}},
					bson.D{{Key: "$sort", Value: bson.D{{Key: "followers", Value: -1}}}},
					bson.D{{Key: "$limit", Value: 7}},
				}},
				{Key: "top_hashtags", Value: bson.A{
					bson.D{{Key: "$unwind", Value: "$hashtags"}},
					bson.D{{Key: "$group", Value: bson.D{
						{Key: "_id", Value: "$hashtags"},
						{Key: "count", Value: bson.D{{Key: "$sum", Value: 1}}},
					}}},
					bson.D{{Key: "$sort", Value: bson.D{{Key: "count", Value: -1}}}},
					bson.D{{Key: "$limit", Value: 6}},
				}},
			}}},
		}

		cursor, err := collection.Aggregate(timeoutCtx, pipeline)
		if err != nil {
			return nil, huma.Error500InternalServerError("Failed to execute charts aggregation", err)
		}
		defer cursor.Close(timeoutCtx)

		var facetResults []models.FacetResult
		if err = cursor.All(timeoutCtx, &facetResults); err != nil || len(facetResults) == 0 {
			return nil, huma.Error500InternalServerError("Failed to decode charts results", err)
		}

		res := facetResults[0]

		if res.TopAccounts == nil {
			res.TopAccounts = []models.Account{}
		}
		if res.TopHashtags == nil {
			res.TopHashtags = []models.Hashtag{}
		}

		uiPayload := models.ChartsResponse{
			TopAccounts: res.TopAccounts,
			TopHashtags: res.TopHashtags,
		}

		return &models.ChartOutput{Body: uiPayload}, nil
	}
}