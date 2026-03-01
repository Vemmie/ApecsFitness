package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/google/generative-ai-go/genai"
	"github.com/joho/godotenv"
	"google.golang.org/api/option"
)

type ChatRequest struct {
	Message string `json:"message"`
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	ctx := context.Background()
	client, err := genai.NewClient(ctx, option.WithAPIKey(os.Getenv("GEMINI_API_KEY")))
	if err != nil {
		log.Fatal(err)
	}
	defer client.Close()

	model := client.GenerativeModel("gemini-2.5-flash")

	// ADD SYSTEM INSTRUCTIONS HERE: This defines the coach's personality
	model.SystemInstruction = &genai.Content{
		Parts: []genai.Part{
			genai.Text("You are the Apecs AI Coach. You are highly technical, encouraging, and focused on fitness data. " +
				"Keep responses concise and actionable. If a user provides workout stats, analyze their performance."),
		},
	}

	http.HandleFunc("/get-coaching", func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}

			var chatReq ChatRequest
			if err := json.NewDecoder(r.Body).Decode(&chatReq); err != nil {
				http.Error(w, "Bad Request", http.StatusBadRequest)
				return
			}

			// Send to Gemini
			resp, err := model.GenerateContent(ctx, genai.Text(chatReq.Message))
			if err != nil {
				// CRITICAL: This line prints the REAL error to your VS Code terminal
				log.Printf("GEMINI API ERROR: %v", err) 
				
				http.Error(w, "Failed to reach Gemini", http.StatusInternalServerError)
				return
			}

			if len(resp.Candidates) > 0 && len(resp.Candidates[0].Content.Parts) > 0 {
				fmt.Fprint(w, resp.Candidates[0].Content.Parts[0])
			} else {
				fmt.Fprint(w, "Keep pushing!")
			}
		})

	fmt.Println("Apecs AI Service running on :8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}