package models

type SummaryAccountItem struct {
	AccountID     string   `json:"account_id" bson:"_id"`
	Username      string   `json:"username" bson:"username"`
	RiskLevel     string   `json:"risk_level" bson:"risk_level"`
	Followers     int      `json:"followers" bson:"followers"`
	Following     int      `json:"following" bson:"following"`
	TotalPosts    int      `json:"total_posts" bson:"total_posts"`
	TotalComments int      `json:"total_comments" bson:"total_comments"`
	TopHashtags   []string `json:"top_hashtags" bson:"top_hashtags"`
	TopEmojis     []string `json:"top_emojis" bson:"top_emojis"`
	TopMusic      []string `json:"top_music" bson:"top_music"`
}

type SummaryTableResponse struct {
	Body struct {
		Items []SummaryAccountItem `json:"items"`
	}
}