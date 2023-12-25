import { Credentials, STS } from '@aws-sdk/client-sts';

export type AssumeRoleOptions = {
  assumeRoleArn: string;
  awsRegion?: string;
};

export async function assumeRole(
  options: AssumeRoleOptions
): Promise<Credentials> {
  const sts = new STS({
    region: options.awsRegion,
  });

  const output = await sts.assumeRole({
    RoleArn: options.assumeRoleArn,
    RoleSessionName: 'lambda-deploy',
  });

  return output.Credentials;
}
