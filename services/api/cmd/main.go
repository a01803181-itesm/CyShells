package main

import (
	"context"
	"cyshells-api/internal/database"
	"cyshells-api/internal/handlers"
	"log/slog"
	"net/http"
	"os"

	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humagin"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
)

func RegisterDashboardRoutes(api huma.API, db *mongo.Database) {
	huma.Register(api, huma.Operation{
		OperationID: "get-dashboard-charts",
		Method: http.MethodGet,
		Path: "/api/v1/dashboard/charts/accounts",
		Summary: "Get account metrics for charts",
		Description: "Returns aggregated followers, posts, and comments per monitored account.",
		Tags: []string{"Dashboard", "Charts", "GET"},
	}, handlers.GetCharts(db))

	huma.Register(api, huma.Operation{
		OperationID: "get-dashboard-metadata",
		Method: http.MethodGet,
		Path: "/api/v1/dashboard/metadata/top",
		Summary: "Get top metadata",
		Description: "Returns the most frequently used hashtags and emojis.",
		Tags: []string{"Dashboard", "Charts", "GET", "Top"},
	}, handlers.GetTopMetadata(db))
}

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	slog.SetDefault(logger)
	
	if err := godotenv.Load(); err != nil {
		slog.Warn("No .env file found or unable to load, relying on system environment variables")
	}
	
	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		slog.Error("MONGO_URI is still empty after loading .env")
		os.Exit(1)
	}

	client := database.Connect(mongoURI)

	defer client.Disconnect(context.Background())

	database := client.Database("cyshells")

	router := gin.Default()
	api := humagin.New(router, huma.DefaultConfig("CyShells API", "1.0.0"))

	RegisterDashboardRoutes(api, database)

	slog.Info("CyShells API starting on :8080")

	http.ListenAndServe(":8080", router)
}