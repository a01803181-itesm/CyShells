package models

type KPI struct {
	ID              string `json:"id"`
	Title           string `json:"title"`
	Value           string `json:"value"`
	Subtext         string `json:"subtext"`
	IndicatorColour string `json:"indicatorColour"`
}

type KPIFacetResult struct {
	PostsAndComments []struct {
		TotalPosts    int64 `bson:"total_posts"`
		TotalComments int64 `bson:"total_comments"`
	} `bson:"posts_and_comments"`

	UniqueAccounts []struct {
		TotalAccounts  int64 `bson:"total_accounts"`
		TotalFollowers int64 `bson:"total_followers"`
	} `bson:"unique_accounts"`

	TopHashtag []struct {
		ID string `bson:"_id"`
	} `bson:"top_hashtag"`

	TopEmoji []struct {
		ID string `bson:"_id"`
	} `bson:"top_emoji"`
}

type KPIOutput struct {
	Body []KPI
}