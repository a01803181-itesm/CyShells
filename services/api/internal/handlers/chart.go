package handlers

import (
	"context"
	"cyshells-api/internal/models"

	"github.com/danielgtaylor/huma/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func GetCharts(db *mongo.Database) func(ctx context.Context, input *struct{}) (*models.ChartsResponse, error) {
	return func(ctx context.Context, input *struct{}) (*models.ChartsResponse, error) {
		collection := db.Collection("tiktoks")

		pipeline := bson.A{
			bson.D{{Key: "$group", Value: bson.D{
				{Key: "_id", Value: "$user.id"},
				{Key: "username", Value: bson.D{{Key: "$first", Value: "$user.username"}}},
				{Key: "followers", Value: bson.D{{Key: "$first", Value: "$user.followers"}}},
				{Key: "posts", Value: bson.D{{Key: "$sum", Value: 1}}},
				{Key: "comments", Value: bson.D{{Key: "$sum", Value: "$comments_count"}}},
			}}},
			bson.D{{Key: "$sort", Value: bson.D{{Key: "followers", Value: -1}}}},
			bson.D{{Key: "$limit", Value: 50}},
		}

		cursor, err := collection.Aggregate(ctx, pipeline)

		if err != nil {
			return nil, huma.Error500InternalServerError("Database aggregation failed", err)
		}

		defer cursor.Close(ctx)

		var items []models.ChartAccountItem
		if err = cursor.All(ctx, &items); err != nil {
			return nil, huma.Error500InternalServerError("Failed to decode charts data", err)
		}

		resp := &models.ChartsResponse{}
		resp.Body.Items = items
		return resp, nil
	}
}

func GetTopMetadata(db *mongo.Database) func(ctx context.Context, input *struct{}) (*models.MetadataResponse, error) {
	return func(ctx context.Context, input *struct{}) (*models.MetadataResponse, error) {
		collection := db.Collection("tiktoks")

		getTopN := func(field string, limit int) ([]models.MetadataItem, error) {
			pipeline := bson.A{
				bson.D{{Key: "$unwind", Value: "$" + field}},
				bson.D{{Key: "$group", Value: bson.D{
					{Key: "_id", Value: "$" + field},
					{Key: "count", Value: bson.D{{Key: "$sum", Value: 1}}},
				}}},
				bson.D{{Key: "$sort", Value: bson.D{{Key: "count", Value: -1}}}},
				bson.D{{Key: "$limit", Value: limit}},
			}

			cursor, err := collection.Aggregate(ctx, pipeline)

			if err != nil {
				return nil, err
			}

			var results []models.MetadataItem
			if err = cursor.All(ctx, &results); err != nil {
				return nil, err
			}

			return results, nil
		}

		hashtags, err := getTopN("hashtags", 10)
		if err != nil {
			return nil, huma.Error500InternalServerError("Failed to fetch hashtags", err)
		}

		emojis, err := getTopN("emojis", 10)
		if err != nil {
			return nil, huma.Error500InternalServerError("Failed to fetch emojis", err)
		}

		resp := &models.MetadataResponse{}
		resp.Body.Hashtags = hashtags
		resp.Body.Emojis = emojis
		resp.Body.Music = []models.MetadataItem{}

		return resp, nil
	}
}
