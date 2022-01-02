module triceratops-show

go 1.16

replace github.com/awslabs/aws-lambda-go-api-proxy => github.com/eh-am/aws-lambda-go-api-proxy v0.12.1-0.20220102142205-492eda2bdf94

require (
	github.com/aws/aws-lambda-go v1.27.1
	github.com/awslabs/aws-lambda-go-api-proxy v0.12.0
	github.com/gorilla/mux v1.8.0
	github.com/markbates/goth v1.68.0
)
