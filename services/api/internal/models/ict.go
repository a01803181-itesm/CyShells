package models

type Omega struct {
	ThreatLevel string              `bson:"threat_level" json:"threat_level"`
	RisksLabels map[string][]string `bson:"risks_labels" json:"risks_labels"`
	Path        string              `bson:"path" json:"path"`
	Filename    string              `bson:"filename" json:"filename"`
	PublicURI   *string             `bson:"public_uri,omitempty" json:"public_uri,omitempty"`
}