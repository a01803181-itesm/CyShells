package models

type KPIs struct {
	TotalMonitoredAccounts    int    `json:"total_monitored_accounts"`
	TotalAccumulatedFollowers int    `json:"total_accumulated_followers"`
	TotalRegisteredVideos     int    `json:"total_registered_videos"`
	TopHastag                 string `json:"top_hashtag"`
	TopEmoji                  string `json:"top_emoji"`
}

type KPIResponse struct {
	Body KPIs
}