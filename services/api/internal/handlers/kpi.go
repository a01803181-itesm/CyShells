package handlers

import (
	"context"
	"cyshells-api/internal/models"
	"cyshells-api/internal/utils"
	"fmt"
	"time"

	"github.com/danielgtaylor/huma/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func GetDashboardKPIs(db *mongo.Database) func(ctx context.Context, input *struct{}) (*models.KPIOutput, error) {
	return func(ctx context.Context, input *struct{}) (*models.KPIOutput, error) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

		defer cancel()

		collection := db.Collection("tiktoks")

		pipeline := mongo.Pipeline{
			{{Key: "$facet", Value: bson.D{
				{Key: "posts_and_comments", Value: bson.A{
					bson.D{{Key: "$group", Value: bson.D{
						{Key: "_id", Value: nil},
						{Key: "total_posts", Value: bson.D{{Key: "$sum", Value: 1}}},
						{Key: "total_comments", Value: bson.D{{Key: "$sum", Value: "$comments_count"}}},
					}}},
				}},

				{Key: "unique_accounts", Value: bson.A{
					bson.D{{Key: "$group", Value: bson.D{
						{Key: "_id", Value: "$user.id"},
						{Key: "followers", Value: bson.D{{Key: "$max", Value: "$user.followers"}}},
					}}},
					bson.D{{Key: "$group", Value: bson.D{
						{Key: "_id", Value: nil},
						{Key: "total_accounts", Value: bson.D{{Key: "$sum", Value: 1}}},
						{Key: "total_followers", Value: bson.D{{Key: "$sum", Value: "$followers"}}},
					}}},
				}},

				{Key: "top_hashtag", Value: bson.A{
					bson.D{{Key: "$unwind", Value: "$hashtags"}},
					bson.D{{Key: "$group", Value: bson.D{
						{Key: "_id", Value: "$hashtags"},
						{Key: "count", Value: bson.D{{Key: "$sum", Value: 1}}},
					}}},
					bson.D{{Key: "$sort", Value: bson.D{{Key: "count", Value: -1}}}},
					bson.D{{Key: "$limit", Value: 1}},
				}},

				{Key: "top_emoji", Value: bson.A{
					bson.D{{Key: "$unwind", Value: "$emojis"}},
					bson.D{{Key: "$group", Value: bson.D{
						{Key: "_id", Value: "$emojis"},
						{Key: "count", Value: bson.D{{Key: "$sum", Value: 1}}},
					}}},
					bson.D{{Key: "$sort", Value: bson.D{{Key: "count", Value: -1}}}},
				}},
			}}},
		}

		cursor, err := collection.Aggregate(ctx, pipeline)

		if err != nil {
			return nil, huma.Error500InternalServerError("Failed to execute KPI aggregation", err)
		}

		defer cursor.Close(ctx)

		var facetResults []models.KPIFacetResult
		if err = cursor.All(ctx, &facetResults); err != nil || len(facetResults) == 0 {
			return nil, huma.Error500InternalServerError("Failed to decode KPI results", err)
		}

		res := facetResults[0]

		var posts, comments, accounts, followers int64
		if len(res.PostsAndComments) > 0 {
			posts = res.PostsAndComments[0].TotalPosts
			comments = res.PostsAndComments[0].TotalComments
		}

		if len(res.UniqueAccounts) > 0 {
			accounts = res.UniqueAccounts[0].TotalAccounts
			followers = res.UniqueAccounts[0].TotalFollowers
		}

		topHashtag := "-"
		if len(res.TopHashtag) > 0 {
			topHashtag = res.TopHashtag[0].ID
		}

		topEmoji := "-"
		if len(res.TopEmoji) > 0 {
			topEmoji = res.TopEmoji[0].ID
		}

		uiPayload := []models.KPI{
			{
				ID:              "accounts",
				Title:           "CUENTAS MONITOREADAS",
				Value:           fmt.Sprintf("%d", accounts),
				Subtext:         "Perfiles Únicos",
				IndicatorColour: "bg-red-500",
			},
			{
				ID:              "followers",
				Title:           "SEGUIDORES TOTALES",
				Value:           utils.FormatMetric(followers),
				Subtext:         "Alcance Acumulado",
				IndicatorColour: "bg-amber-500",
			},
			{
				ID:              "posts",
				Title:           "PUBLICACIONES",
				Value:           fmt.Sprintf("%d", posts),
				Subtext:         "Videos Registrados",
				IndicatorColour: "bg-blue-500",
			},
			{
				ID:              "comments",
				Title:           "COMENTARIOS",
				Value:           utils.FormatMetric(comments),
				Subtext:         "Interacciones",
				IndicatorColour: "bg-indigo-500",
			},
			{
				ID:              "hashtag",
				Title:           "HASHTAG PRINCIPAL",
				Value:           topHashtag,
				Subtext:         "Más Frecuente",
				IndicatorColour: "bg-cyan-500",
			},
			{
				ID:              "emoji",
				Title:           "EMOJI PRINCIPAL",
				Value:           topEmoji,
				Subtext:         "Más Frecuente",
				IndicatorColour: "bg-purple-500",
			},
		}

		return &models.KPIOutput{Body: uiPayload}, nil
	}
}
