package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/davyzhang/agw"
	"github.com/gorilla/mux"
	//	"github.com/justinas/alice"
)

func testhandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("test", "test header")

	agw.WriteResponse(w, map[string]string{
		"test": "test body",
	}, false)
	//	w.(*agw.LPResponse).WriteBody(map[string]string{
	//		"test":    "test body",
	//		"funcArn": agw.LambdaContext.InvokedFunctionArn, //can access context as global variable
	//		"event":   string(agw.RawMessage),               //can access RawMessage as global variable
	//	}, false)
}

func main() {
	//use any exsiting router supporting the standard http.Handler
	//like 	"github.com/gorilla/mux"
	//	mux := mux.NewRouter()
	//	mux.HandleFunc("/test1/hello", testhandler)
	//	//lambda is from official sdk "https://github.com/aws/aws-lambda-go"
	//	lambda.Start(agw.Handler(mux))

	HTTPEntry()
}

func buildMux() http.Handler {
	mux := mux.NewRouter()
	//	cors := alice.New(agw.Logging, agw.EnableCORS)
	//	mux.Get("/test").Handler(cors.ThenFunc(testhandler))
	//	mux.Get("/test").HandlerFunc(testhandler)
	mux.HandleFunc("/test", testhandler)

	return mux
	//	mux.Options("/*", cors.ThenFunc(handlerDummy)) //handle option requests to support POST/PATCH.. requests
}

func DevHTTPEntry() {
	addr := "localhost:3000"
	srv := &http.Server{
		Handler:      buildMux(),
		Addr:         addr,
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Println("Starting local server on", addr)
	log.Fatal(srv.ListenAndServe())
}

func LambdaHTTPEntry() {
	lambda.Start(func() agw.GatewayHandler {
		return func(ctx context.Context, event json.RawMessage) (interface{}, error) {
			agp := agw.NewAPIGateParser(event)
			return agw.Process(agp, buildMux()), nil
		}
	}())
}

func HTTPEntry() {
	plat, ok := os.LookupEnv("APP_PLATFORM")
	if !ok || plat != "Lambda" {
		DevHTTPEntry()
	} else {
		LambdaHTTPEntry()
	}
}
