package models

import "time"

type TableRow struct {
	VideoID     string    `json:"video_id"`
	Username    string    `json:"username"`
	AvatarURL   string    `json:"avatarUrl"`
	Description string    `json:"description"`
	Plays       int       `json:"plays"`
	Likes       int       `json:"likes"`
	RiskLevel   string    `json:"risk_level"`
	ScrapedAt   time.Time `json:"scraped_at"`
}

type TableResponse struct {
	Total int64      `json:"total"`
	Page  int        `json:"page"`
	Limit int        `json:"limit"`
	Data  []TableRow `json:"data"`
}

type TableInput struct {
	Page   int    `query:"page" default:"1" minimum:"1" doc:"Page number"`
	Limit  int    `query:"limit" default:"10" minimum:"1" maximum:"100" doc:"Items per page"`
	Search string `query:"search" required:"false" doc:"Search by username or description"`
	Risk   string `query:"risk" required:"false" doc:"Filter by Omega risk level (ALTO, MEDIO, NULO)"`
}

type TableOutput struct {
	Body TableResponse
}