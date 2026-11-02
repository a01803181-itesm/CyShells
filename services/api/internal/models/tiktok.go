package models

import "time"

type TikTokUser struct {
	ID                 string `bson:"id" json:"id"`
	Username           string `bson:"username" json:"username"`
	Nickname           string `bson:"nickname" json:"nickname"`
	AvatarURL          string `bson:"avatar_url" json:"avatar_url"`
	Followers          int    `bson:"followers" json:"followers"`
	Following          int    `bson:"following" json:"following"`
	TotalLikesReceived int    `bson:"total_likes_received" json:"total_likes_received"`
	TotalTikToks       int    `bson:"total_tiktoks" json:"total_tiktoks"`
}

type TikTok struct {
	ID            string     `bson:"id" json:"id"`
	URL           string     `bson:"url" json:"url"`
	User          TikTokUser `bson:"user" json:"user"`
	Description   string     `bson:"description,omitempty" json:"description,omitempty"`
	Created       time.Time  `bson:"created" json:"created"`
	CoverURL      string     `bson:"cover_url,omitempty" json:"cover_url,omitempty"`
	PlaysCount    int        `bson:"plays_count" json:"plays_count"`
	DiggsCount    int        `bson:"diggs_count" json:"diggs_count"`
	CommentsCount int        `bson:"comments_count" json:"comments_count"`
	SharedCount   int        `bson:"shared_count" json:"shared_count"`
	Hashtags      []string   `bson:"hashtags" json:"hashtags"`
	Emojis        []string   `bson:"emojis" json:"emojis"`
	ScrapedAt     time.Time  `bson:"scraped_at" json:"scraped_at"`
}