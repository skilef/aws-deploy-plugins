import {
  CloudFront,
  UpdateDistributionCommandOutput,
} from '@aws-sdk/client-cloudfront';
import { Lambda } from '@aws-sdk/client-lambda';

export type updateCloudFrontLambdaAssociationOptions = {
  functionName: string;
  cloudFrontDistributionId: string;
  cloudFrontEventType:
    | 'origin-request'
    | 'origin-response'
    | 'viewer-request'
    | 'viewer-response';
  version: string;
  awsRegion?: string;
};

export async function updateCloudFrontLambdaAssociation(
  options: updateCloudFrontLambdaAssociationOptions
): Promise<UpdateDistributionCommandOutput> {
  const lambda = new Lambda({
    region: options.awsRegion,
  });

  // Wait for the lambda function to be active

  let isFunctionActive = false;

  while (!isFunctionActive) {
    try {
      const res = await lambda.getFunction({
        FunctionName: options.functionName,
        Qualifier: options.version,
      });
      if (res.Configuration?.State === 'Active') {
        isFunctionActive = true;
      }
    } catch (e) {
      /* empty */
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const cloudfront = new CloudFront();

  const { DistributionConfig, ETag } = await cloudfront.getDistributionConfig({
    Id: options.cloudFrontDistributionId,
  });

  const lambdaAssociations =
    DistributionConfig?.DefaultCacheBehavior?.LambdaFunctionAssociations?.Items;

  if (!lambdaAssociations) {
    throw new Error('No lambda associations found');
  }

  const lambdaAssociationIdx = lambdaAssociations.findIndex(
    (item) => item.EventType === options.cloudFrontEventType
  );

  if (lambdaAssociationIdx === -1) {
    throw new Error(
      `No ${options.cloudFrontEventType} lambda association found`
    );
  }

  const previousArn =
    lambdaAssociations[lambdaAssociationIdx].LambdaFunctionARN;

  lambdaAssociations[lambdaAssociationIdx].LambdaFunctionARN =
    previousArn!.replace(/[0-9]+$/, options.version);

  return cloudfront.updateDistribution({
    Id: options.cloudFrontDistributionId,
    DistributionConfig,
    IfMatch: ETag,
  });
}
