import { S3, PutObjectCommandOutput } from '@aws-sdk/client-s3';
import { readFile } from 'fs/promises';
import { AwsCredentialIdentityProvider } from '@aws-sdk/types';

export type UploadPackageOptions = {
  packageFilePath: string;
  s3Bucket: string;
  s3Key: string;
  awsRegion?: string;
  credentials?: AwsCredentialIdentityProvider;
};

export async function uploadPackage(
  options: UploadPackageOptions
): Promise<PutObjectCommandOutput> {
  const s3 = new S3({
    region: options.awsRegion,
    credentials: options.credentials,
  });

  const packageContents = await readFile(options.packageFilePath);

  return s3.putObject({
    Bucket: options.s3Bucket,
    Key: options.s3Key,
    Body: packageContents,
  });
}
