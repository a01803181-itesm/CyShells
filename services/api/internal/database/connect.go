package database

import (
	"context"
	"log/slog"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func Connect(uri string) *mongo.Client {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))

	if err != nil {
		slog.Error("Failed to build MongoDB client", "error", err)
		panic(err)
	}

	if err := client.Ping(ctx, nil); err != nil {
		slog.Error("Failed to ping MongoDB instance", "error", err)
		panic(err)
	}

	return client
}