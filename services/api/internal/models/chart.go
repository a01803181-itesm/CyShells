package models

type ChartAccountItem struct {
	Username  string `json:"username" bson:"username"`
	Followers int    `json:"followers" bson:"followers"`
	Posts     int    `json:"posts" bson:"posts"`
	Comments  int    `json:"comments" bson:"comments"`
}

type ChartsResponse struct {
	Body struct {
		Items []ChartAccountItem `json:"items"`
	}
}

type MetadataItem struct {
	Name  string `json:"name" bson:"_id"`
	Count int    `json:"count" bson:"count"`
}

type MetadataResponse struct {
	Body struct {
		Hashtags []MetadataItem `json:"hashtags"`
		Emojis   []MetadataItem `json:"emojis"`
		Music    []MetadataItem `json:"music"`
	}
}