import * as apigw from "@aws-cdk/aws-apigatewayv2";
import * as integrations from "@aws-cdk/aws-apigatewayv2-integrations";
import * as acm from "@aws-cdk/aws-certificatemanager";
import * as cdk from "@aws-cdk/core";
import Function from "./constructs/function.js";

class Stack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    this.oauth();
    this.cutMp3();
  }

  cutMp3() {
    const domainName = "cutmp3.triceratops.show";

    const certificate = new acm.Certificate(this, "Cutmp3Certificate", {
      domainName,
      validation: acm.CertificateValidation.fromDns(), // Records must be added manually
    });

    const handler = Function(this, "Cut mp3 Handler", {
      entry: "auth/go/cmd/cut-mp3",
    });

    const dn = new apigw.DomainName(this, "CutMp3DN", {
      domainName,
      certificate,
    });

    const api = new apigw.HttpApi(this, "Cut mp3 Handler API Gateway", {
      defaultDomainMapping: {
        domainName: dn,
      },
    });

    const routes = ["/", "/cut"];

    routes.forEach((route) => {
      api.addRoutes({
        path: route,
        methods: [apigw.HttpMethod.GET],
        integration: new integrations.HttpLambdaIntegration(
          "Cut mp3 handler",
          handler,
          {}
        ),
      });
    });
  }

  oauth() {
    const oauthDomainName = "auth.triceratops.show";

    const oauthCertificate = new acm.Certificate(this, "Certificate", {
      domainName: oauthDomainName,
      validation: acm.CertificateValidation.fromDns(), // Records must be added manually
    });
    const oauthHandler = Function(this, "OAuth Handler", {
      entry: "auth/go/cmd/oauth",
    });
    const oauthDN = new apigw.DomainName(this, "DN", {
      domainName: oauthDomainName,
      certificate: oauthCertificate,
    });

    const oauthAPI = new apigw.HttpApi(this, "Oauth Handler", {
      defaultDomainMapping: {
        domainName: oauthDN,
      },
    });

    const oauthRoutes = [
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

    oauthRoutes.forEach((route) => {
      oauthAPI.addRoutes({
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
