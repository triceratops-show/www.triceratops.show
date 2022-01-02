package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/awslabs/aws-lambda-go-api-proxy/gorillamux"
	"github.com/gorilla/mux"
	"github.com/markbates/goth"
	"github.com/markbates/goth/providers/github"
)

func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, _ := json.Marshal(payload)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}

func testhandler(w http.ResponseWriter, r *http.Request) {
	respondWithJSON(w, 200, map[string]string{"hello": "world"})
}

func main() {
	host := os.Getenv("HOST")
	if host == "" {
		panic("env var 'HOST' is required")
	}

	githubKey := os.Getenv("GITHUB_KEY")
	if githubKey == "" {
		panic("env var 'GITHUB_KEY' is required")
	}

	githubSecret := os.Getenv("GITHUB_SECRET")
	if githubSecret == "" {
		panic("env var 'GITHUB_SECRET' is required")
	}

	goth.UseProviders(
		github.New(
			githubKey, githubSecret,
			fmt.Sprintf("https://%s/callback/github", host),
			"user",
			"repo",
		),
	)

	r := buildMux(Config{host})
	if !isRunningInLambda() {
		DevHTTPEntry(r)
	} else {
		LambdaHTTPEntry(r)
	}
}

func DevHTTPEntry(r *mux.Router) {
	addr := "localhost:3000"
	srv := &http.Server{
		Handler:      r,
		Addr:         addr,
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Println("Starting local server on", addr)
	log.Fatal(srv.ListenAndServe())
}

func LambdaHTTPEntry(r *mux.Router) {
	adapter := gorillamux.NewV2(r)

	handler := func(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
		return adapter.ProxyWithContext(ctx, req)
	}

	lambda.Start(handler)
}

func isRunningInLambda() bool {
	// anything set here should work
	// https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html#configuration-envvars-runtime
	_, ok := os.LookupEnv("LAMBDA_TASK_ROOT")
	return ok
}
