package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"
)

// Data structure for the JSON payload
type LogData struct {
	Level       string    `json:"level"`
	Message     string    `json:"message"`
	ResourceID  string    `json:"resourceId"`
	Timestamp   time.Time `json:"timestamp"`
	TraceID     string    `json:"traceId"`
	SpanID      string    `json:"spanId"`
	Commit      string    `json:"commit"`
	Metadata    Metadata  `json:"metadata"`
}

type Metadata struct {
	ParentResourceID string `json:"parentResourceId"`
}

func main() {
	// URL to send the POST request to
	url := "http://localhost:3000"

	// Data to be sent in the POST request
	

	// Make 100 POST requests
	count:=1000
	for i := 1; i <= 1000; i++ {
		count++

		postData := LogData{
			Level:      "error",
			Message:    "Failed to connect to DB",
			ResourceID: "server-"+strconv.Itoa(count),
			Timestamp:  time.Now().UTC(),
			TraceID:    "abc-xyz-"+strconv.Itoa(count),
			SpanID:     "span-456",
			Commit:     "5e5342f",
			Metadata: Metadata{
				ParentResourceID: "server-0987",
			},
		}
		fmt.Printf("Sending request %d...\n", i)
		if err := sendPostRequest(url, postData); err != nil {
			fmt.Printf("Error sending request %d: %v\n", i, err)
		}
	}
}

// Function to send a POST request
func sendPostRequest(url string, data LogData) error {
	// Convert data to JSON
	jsonData, err := json.Marshal(data)
	if err != nil {
		return err
	}

	// Make a POST request
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	// Print the response status
	fmt.Printf("Response Status for request: %s\n", resp.Status)

	return nil
}
