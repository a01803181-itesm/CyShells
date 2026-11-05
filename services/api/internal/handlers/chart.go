package handlers

import (
	"context"
	"cyshells-api/internal/models"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func GetDashboardCharts(db *mongo.Database) func(context.Context, *struct{}) (*models.ChartOutput, error) {
	return func(ctx context.Context, input *struct{}) (*models.ChartOutput, error) {
		timeoutCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
		defer cancel()
		
		pipeline := mongo.Pipeline{
			{{Key: "$facet", Value: bson.D{
				{Key: "top_followers", Value: bson.A{
					bson.D{{Key: "$group", Value: bson.D{
						{Key: "_id", Value: "$user.username"},
						{Key: "followers", Value: bson.D{{Key: "$max", Value: "$user.followers"}}},
					}}},
					bson.D{{Key: "$sort", Value: bson.D{{Key: "followers", Value: -1}}}},
					bson.D{{Key: "$limit", Value: 7}},
				}},
				{Key: "top_posts", Value: bson.A{
					bson.D{{Key: "$group", Value: bson.D{
						{Key: "_id", Value: "$user.username"},
						// Assuming you want the total tiktoks the user has on their profile:
						{Key: "posts", Value: bson.D{{Key: "$max", Value: "$user.total_tiktoks"}}},
					}}},
					bson.D{{Key: "$sort", Value: bson.D{{Key: "posts", Value: -1}}}},
					bson.D{{Key: "$limit", Value: 7}},
				}},
			}}},
		}

		cursor, _ := db.Collection("tiktoks").Aggregate(timeoutCtx, pipeline)
		defer cursor.Close(timeoutCtx)

		var results []models.ChartFacetResult
		cursor.All(timeoutCtx, &results)
		res := results[0]

		if res.TopFollowers == nil { res.TopFollowers = []models.AccountFollowers{} }
		if res.TopPosts == nil { res.TopPosts = []models.AccountPosts{} }

		return &models.ChartOutput{Body: models.ChartsResponse{
			TopFollowers: res.TopFollowers,
			TopPosts:     res.TopPosts,
		}}, nil
	}
}

func GetDashboardMetadata(db *mongo.Database) func(context.Context, *struct{}) (*models.MetadataOutput, error) {
	return func(ctx context.Context, input *struct{}) (*models.MetadataOutput, error) {
		timeoutCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
		defer cancel()
		
		pipeline := mongo.Pipeline{
			{{Key: "$facet", Value: bson.D{
				{Key: "top_hashtags", Value: bson.A{
					bson.D{{Key: "$unwind", Value: "$hashtags"}},
					bson.D{{Key: "$group", Value: bson.D{
						{Key: "_id", Value: "$hashtags"},
						{Key: "count", Value: bson.D{{Key: "$sum", Value: 1}}},
					}}},
					bson.D{{Key: "$sort", Value: bson.D{{Key: "count", Value: -1}}}},
					bson.D{{Key: "$limit", Value: 10}}, // Top 10 for the UI list
				}},
				{Key: "top_emojis", Value: bson.A{
					bson.D{{Key: "$unwind", Value: "$emojis"}},
					bson.D{{Key: "$group", Value: bson.D{
						{Key: "_id", Value: "$emojis"},
						{Key: "count", Value: bson.D{{Key: "$sum", Value: 1}}},
					}}},
					bson.D{{Key: "$sort", Value: bson.D{{Key: "count", Value: -1}}}},
					bson.D{{Key: "$limit", Value: 10}},
				}},
			}}},
		}

		cursor, _ := db.Collection("tiktoks").Aggregate(timeoutCtx, pipeline)
		defer cursor.Close(timeoutCtx)

		var results []models.MetadataFacetResult
		cursor.All(timeoutCtx, &results)
		res := results[0]

		if res.TopHashtags == nil { res.TopHashtags = []models.MetadataItem{} }
		if res.TopEmojis == nil { res.TopEmojis = []models.MetadataItem{} }

		return &models.MetadataOutput{Body: models.MetadataResponse{
			TopHashtags: res.TopHashtags,
			TopEmojis:   res.TopEmojis,
		}}, nil
	}
}