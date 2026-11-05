package models

type GalleryCard struct {
	ID     string   `json:"id"`
	User   string   `json:"user"`
	Risk   string   `json:"risk"`
	Labels []string `json:"labels"`
	Image  string   `json:"image"`
}

type GalleryResponse struct {
	Data []GalleryCard `json:"data"`
}

type GalleryInput struct {
	Risk  string `query:"risk" required:"false" doc:"Filter by risk level (ALTO, MEDIO, NULO)"`
	Limit int    `query:"limit" default:"50" minimum:"1" maximum:"100" doc:"Max images to return"`
}

type GalleryOutput struct {
	Body GalleryResponse
}
