module triceratops-show

go 1.16

replace github.com/awslabs/aws-lambda-go-api-proxy => github.com/eh-am/aws-lambda-go-api-proxy v0.12.1-0.20220102142205-492eda2bdf94

require (
	github.com/aws/aws-lambda-go v1.30.0
	github.com/awslabs/aws-lambda-go-api-proxy v0.13.2
	github.com/golang-jwt/jwt v3.2.1+incompatible // indirect
	github.com/golang/protobuf v1.5.2 // indirect
	github.com/gorilla/mux v1.8.0
	github.com/gorilla/sessions v1.2.1 // indirect
	github.com/markbates/goth v1.71.1
	golang.org/x/net v0.0.0-20220420153159-1850ba15e1be // indirect
	golang.org/x/oauth2 v0.0.0-20220411215720-9780585627b5 // indirect
	google.golang.org/appengine v1.6.7 // indirect
	google.golang.org/protobuf v1.28.0 // indirect
)
