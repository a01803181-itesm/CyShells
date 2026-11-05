package models

type AccountFollowers struct {
	Name      string `bson:"_id" json:"name"`
	Followers int64  `bson:"followers" json:"followers"`
}

type AccountPosts struct {
	Name  string `bson:"_id" json:"name"`
	Posts int64  `bson:"posts" json:"posts"`
}

type ChartsResponse struct {
	TopFollowers []AccountFollowers `json:"topFollowers"`
	TopPosts     []AccountPosts     `json:"topPosts"`
}

type ChartFacetResult struct {
	TopFollowers []AccountFollowers `bson:"top_followers"`
	TopPosts     []AccountPosts     `bson:"top_posts"`
}

type ChartOutput struct {
	Body ChartsResponse
}

type MetadataItem struct {
	Name  string `bson:"_id" json:"name"`
	Count int64  `bson:"count" json:"count"`
}

type MetadataResponse struct {
	TopHashtags []MetadataItem `json:"topHashtags"`
	TopEmojis   []MetadataItem `json:"topEmojis"`
}

type MetadataFacetResult struct {
	TopHashtags []MetadataItem `bson:"top_hashtags"`
	TopEmojis   []MetadataItem `bson:"top_emojis"`
}

type MetadataOutput struct {
	Body MetadataResponse
}