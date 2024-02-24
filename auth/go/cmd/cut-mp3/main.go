package main

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path"
	"strings"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/awslabs/aws-lambda-go-api-proxy/gorillamux"
	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/cut", handleCut)

	if !isRunningInLambda() {
		DevHTTPEntry(r)
	} else {
		LambdaHTTPEntry(r)
	}
}

func run() (string, error) {
	return "Hello world", nil
}

func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, _ := json.Marshal(payload)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}

func isEmpty(s string) bool {
	return len(strings.TrimSpace(s)) <= 0
}

type ErrorMessage struct {
	Error string `json:"error"`
}

func handleCut(w http.ResponseWriter, r *http.Request) {
	from := r.URL.Query().Get("from")
	to := r.URL.Query().Get("to")
	file := r.URL.Query().Get("file")

	fmt.Println("file", file)
	fmt.Println("from", from)
	fmt.Println("to", to)

	if isEmpty(from) {
		respondWithJSON(w, 400, ErrorMessage{Error: "Field 'from' is required"})
		return
	}
	if isEmpty(to) {
		respondWithJSON(w, 400, ErrorMessage{Error: "Field 'to' is required"})
		return
	}
	if isEmpty(file) {
		respondWithJSON(w, 400, ErrorMessage{Error: "Field 'file' is required"})
		return
	}

	fmt.Println("Downloading file", file)
	f, err := download(file)
	if err != nil {
		respondWithJSON(w, 500, ErrorMessage{Error: "Failed to download file: " + err.Error()})
		return
	}

	fmt.Println("Trimming file")
	data, err := trim(f, from, to)
	if err != nil {
		respondWithJSON(w, 500, ErrorMessage{Error: "Failed to trim file: " + err.Error()})
		return
	}

	fmt.Println("Returning data")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	w.Write(data)

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

func download(url string) (string, error) {
	fmt.Println("downloading", url)
	filepath := path.Join("/tmp/", TempFileName()+".mp3")

	// Create the file
	out, err := os.Create(filepath)
	if err != nil {
		return "", err
	}
	defer out.Close()

	// TODO: cache
	// TODO check it's a url to www.triceratops.show/episodios
	// TODO load this from s3 which should be faster?
	resp, err := http.Get(url)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("bad status", resp.Status)
	}

	_, err = io.Copy(out, resp.Body)
	if err != nil {
		return "", err
	}

	return filepath, nil
}

func cli() {
	fileName := os.Args[1]
	from := os.Args[2]
	to := os.Args[3]

	_, err := trim(fileName, from, to)
	if err != nil {
		panic(err)
	}
}

func TempFileName() string {
	randbytes := make([]byte, 16)
	rand.Read(randbytes)
	return hex.EncodeToString(randbytes)
}

func trim(file string, from string, to string) (mp3 []byte, err error) {
	// Assume it's mp3
	output := path.Join("/tmp/", TempFileName()+".mp3")

	args := []string{
		"-i", file,
		"-ss", from,
		"-to", to,
		output,
	}

	fmt.Println("Running", "ffmpeg", strings.Join(args, " "))
	cmd := exec.Command("ffmpeg", args...)
	out, err := cmd.CombinedOutput()
	if err != nil {
		return mp3, errors.New(string(out))
	}

	mp3, err = os.ReadFile(output)
	defer os.RemoveAll(output)

	if err != nil {
		return mp3, err
	}

	return mp3, nil
}
