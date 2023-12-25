import { Credentials } from '@aws-sdk/client-sts';

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
} // eslint-disable-line

export interface NormalizedDeployExecutorSchema
  extends Required<DeployExecutorSchema> {
  credentials?: Credentials;
  isUploadToS3: boolean;
  isAssumeRole: boolean;
}
