import { Credentials } from '@aws-sdk/client-sts';
import { assumeRole } from './assume-role';

const credentials: Credentials = {
  AccessKeyId: 'access-key-id',
  SecretAccessKey: 'secret-access-key',
  SessionToken: 'session-token',
  Expiration: new Date(),
};

jest.mock('@aws-sdk/client-sts', () => {
  return {
    STS: jest.fn().mockImplementation(() => {
      return {
        assumeRole: jest.fn().mockResolvedValue({
          Credentials: credentials,
        }),
      };
    }),
  };
});

describe('assumeRole', () => {
  it('should assume role', async () => {
    const output = await assumeRole({
      assumeRoleArn: 'arn:aws:iam::123456789012:role/lambda-deploy',
    });

    return expect(output).toEqual(credentials);
  });
});
