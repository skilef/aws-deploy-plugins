import {
  Lambda,
  UpdateFunctionCodeCommandOutput,
} from '@aws-sdk/client-lambda';
import { Credentials } from '@aws-sdk/client-sts';
import { readFile } from 'fs/promises';

export type UpdateFunctionOptions = {
  functionName: string;
  s3Bucket?: string;
  s3Key?: string;
  packageFilePath?: string;
  awsRegion?: string;
  credentials?: Required<Credentials>;
  publish: boolean;
};

export async function updateFunction(
  options: UpdateFunctionOptions
): Promise<UpdateFunctionCodeCommandOutput> {
  const lambda = new Lambda({
    region: options.awsRegion,
    credentials: options.credentials
      ? {
          accessKeyId: options.credentials.AccessKeyId,
          secretAccessKey: options.credentials.SecretAccessKey,
          sessionToken: options.credentials.SessionToken,
        }
      : undefined,
  });

  let packageFileContent: Buffer;

  if (!options.s3Bucket) {
    packageFileContent = await readFile(options.packageFilePath);
  }

  return lambda.updateFunctionCode({
    FunctionName: options.functionName,
    S3Bucket: options.s3Bucket,
    S3Key: options.s3Bucket ? options.s3Key : undefined,
    ZipFile: packageFileContent,
    Publish: options.publish,
  });
}
