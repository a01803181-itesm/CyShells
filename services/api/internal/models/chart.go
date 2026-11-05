package models

type Account struct {
	Name      string `bson:"_id" json:"name"`
	Followers int64  `bson:"followers" json:"followers"`
}

type Hashtag struct {
	Label string `bson:"_id" json:"label"`
	Count int64  `bson:"count" json:"count"`
}

type ChartsResponse struct {
	TopAccounts []Account `json:"top_accounts"`
	TopHashtags []Hashtag `json:"top_hashtags"`
}

type FacetResult struct {
	TopAccounts []Account `bson:"top_accounts"`
	TopHashtags []Hashtag `bson:"top_hashtags"`
}

type ChartOutput struct {
	Body ChartsResponse
}