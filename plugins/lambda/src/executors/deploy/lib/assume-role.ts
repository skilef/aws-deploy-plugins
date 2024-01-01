import { Credentials, STS } from '@aws-sdk/client-sts';

export type AssumeRoleOptions = {
  assumeRoleArn: string;
  awsRegion?: string;
};

/**
 * Assume a role and return the credentials
 * @param options Options
 * @returns Credentials
 */
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
