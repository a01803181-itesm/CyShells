package utils

import "fmt"

func FormatMetric(val int64) string {
	if val >= 1000000 {
		return fmt.Sprintf("%.1fM", float64(val) / 1000000.0)
	}
	if val >= 1000 {
		return fmt.Sprintf("%.1fK", float64(val)/1000.0)
	}
	return fmt.Sprintf("%d", val)
}