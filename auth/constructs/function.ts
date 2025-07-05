import * as lambda from "@aws-cdk/aws-lambda";
import * as golambda from "@aws-cdk/aws-lambda-go-alpha";
import { Construct } from "constructs";

export default function Function(
  scope: Construct,
  id: string,
  props: golambda.GoFunctionProps
) {
  props = {
    tracing: lambda.Tracing.ACTIVE,
    //    insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_98_0,
    ...props,
  };

  return new golambda.GoFunction(scope, id, props);
}
