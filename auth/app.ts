import * as apigw from "@aws-cdk/aws-apigatewayv2";
import * as integrations from "@aws-cdk/aws-apigatewayv2-integrations";
import * as acm from "@aws-cdk/aws-certificatemanager";
import * as cdk from "@aws-cdk/core";
import Function from "./constructs/function.js";

class Stack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const domainName = "auth.triceratops.show";

    const certificate = new acm.Certificate(this, "Certificate", {
      domainName,
      validation: acm.CertificateValidation.fromDns(), // Records must be added manually
    });

    const oauthHandler = Function(this, "OAuth Handler", {
      entry: "auth/go/cmd/oauth",
    });

    const dn = new apigw.DomainName(this, "DN", {
      domainName,
      certificate,
    });

    const api = new apigw.HttpApi(this, "Oauth Handler", {
      defaultDomainMapping: {
        domainName: dn,
      },
    });

    const routes = [
      "/",
      "/success",
      "/refresh",
      "/callback/{provider}",
      "/auth/{provider}",
      "/auth",
    ];

    const parameterMapping = new apigw.ParameterMapping();
    parameterMapping.appendHeader("Cookie", {
      value: "method.request.header.Cookie",
    });

    routes.forEach((route) => {
      api.addRoutes({
        path: route,
        methods: [apigw.HttpMethod.GET],
        integration: new integrations.HttpLambdaIntegration(
          "OAuth handler",
          oauthHandler,
          {
            parameterMapping,
          }
        ),
      });
    });
  }
}

const app = new cdk.App();
new Stack(app, "TriceratopsShowStack");
