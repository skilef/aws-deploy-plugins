import { AwsCredentialIdentityProvider } from '@aws-sdk/types';

export interface DeployExecutorSchema {
  functionName?: string;
  awsRegion?: string;
  assumeRoleArn?: string;
  s3Bucket?: string;
  s3Key?: string;
  buildDirectoryPath?: string;
  compressionLevel?: number;
  deleteLocalPackage?: boolean;
  packageFilePath?: string;
  publish?: boolean;
  cloudFrontDistributionId?: string;
  cloudFrontEventType?:
    | 'origin-request'
    | 'origin-response'
    | 'viewer-request'
    | 'viewer-response';
} // eslint-disable-line

export interface NormalizedDeployExecutorSchema
  extends Required<DeployExecutorSchema> {
  credentials?: AwsCredentialIdentityProvider;
  isUploadToS3: boolean;
  isAssumeRole: boolean;
  isLambdaEdge: boolean;
}
