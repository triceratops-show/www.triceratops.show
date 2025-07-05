import * as apigw from "@aws-cdk/aws-apigatewayv2";
import * as cdk from "aws-cdk-lib";
import Function from "./constructs/function.js";

class Stack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const domainName = "api.triceratops.show";

    const zone = cdk.aws_route53.HostedZone.fromLookup(this, "Zone", {
      domainName: "triceratops.show",
    });

    const certificate = new cdk.aws_certificatemanager.DnsValidatedCertificate(
      this,
      "SiteCertificate",
      {
        domainName: domainName,
        hostedZone: zone,
        region: "sa-east-1",
        validation:
          cdk.aws_certificatemanager.CertificateValidation.fromDns(zone),
      }
    );

    const oauthHandler = Function(this, "OAuth Handler", {
      entry: "auth/go/cmd/oauth",
      environment: {
        HOST: mustFromEnv("HOST"),
        GITHUB_KEY: mustFromEnv("GITHUB_KEY"),
        GITHUB_SECRET: mustFromEnv("GITHUB_SECRET"),
      },
    });

    const dn = new cdk.aws_apigatewayv2.DomainName(this, "DN", {
      domainName: domainName,
      certificate,
    });

    const api = new cdk.aws_apigatewayv2.HttpApi(this, "API Handler", {
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
        integration:
          new cdk.aws_apigatewayv2_integrations.HttpLambdaIntegration(
            "API handler",
            oauthHandler,
            {
              parameterMapping,
            }
          ),
      });
    });

    // Route53 for the apigatewayv2
    new cdk.aws_route53.ARecord(this, "SiteAliasRecord", {
      recordName: domainName,
      ttl: cdk.Duration.minutes(5),
      target: cdk.aws_route53.RecordTarget.fromAlias(
        new cdk.aws_route53_targets.ApiGatewayv2DomainProperties(
          dn.regionalDomainName,
          dn.regionalHostedZoneId
        )
      ),
      zone,
    });
  }
}

const app = new cdk.App();
new Stack(app, "TriceratopsShowStack", {
  env: {
    account: "201973741866",
    region: "sa-east-1",
  },
});

function mustFromEnv(s: string): string {
  const val = process.env[s];
  if (!val) {
    throw new Error(`env var ${s} is undefined or empty`);
  }

  return val;
}
