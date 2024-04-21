import { uploadPackage } from './upload-package';
import { readFile } from 'fs/promises';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';

const s3Mock = mockClient(S3Client);

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));

describe('uploadPackage', () => {

  beforeEach(() => {
    s3Mock.reset();
  });

  it('should throw if readFile throws', async () => {
    // Arrange
    (readFile as jest.Mock).mockRejectedValueOnce(new Error('readFile error'));
    const options = {
      packageFilePath: 'packageFilePath',
      s3Bucket: 's3Bucket',
      s3Key: 's3Key',
    };

    // Act
    const res = uploadPackage(options)

    // Assert
    await expect(res).rejects.toThrow('readFile error');
    expect(s3Mock).not.toHaveReceivedAnyCommand();
  });

  it('should reject if s3.putObject rejects', async () => {
    // Arrange
    (readFile as jest.Mock).mockResolvedValueOnce('packageContents');

    s3Mock.on(PutObjectCommand).rejects(new Error('putObject error'));

    const options = {
      packageFilePath: 'packageFilePath',
      s3Bucket: 's3Bucket',
      s3Key: 's3Key',
    };

    // Act
    const res = uploadPackage(options)

    // Assert
    await expect(res).rejects.toThrow('putObject error');
    expect(s3Mock).toHaveReceivedCommand(PutObjectCommand);
  });
});
