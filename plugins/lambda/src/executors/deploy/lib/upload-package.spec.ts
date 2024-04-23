import { uploadPackage } from './upload-package';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import * as mockFs from 'mock-fs';

const s3Mock = mockClient(S3Client);

describe('uploadPackage', () => {
  beforeEach(() => {
    mockFs({
      'package.zip': 'packageContents',
    });
  });

  afterEach(() => {
    s3Mock.reset();
    mockFs.restore();
  });

  it('should throw if the package file does not exist', async () => {
    // Arrange

    const options = {
      packageFilePath: 'wrong_package.zip',
      s3Bucket: 's3Bucket',
      s3Key: 's3Key',
    };

    expect.assertions(2);

    try {
      // Act
      await uploadPackage(options);
    } catch (err) {
      // Assert
      expect(err.message).toMatch('no such file or directory');
      expect(s3Mock).not.toHaveReceivedAnyCommand();
    }
  });

  it('should reject if s3.putObject rejects', async () => {
    // Arrange
    s3Mock.on(PutObjectCommand).rejects(new Error('putObject error'));

    const options = {
      packageFilePath: 'package.zip',
      s3Bucket: 's3Bucket',
      s3Key: 's3Key',
    };

    expect.assertions(2);

    try {
      // Act
      await uploadPackage(options);
    } catch (err) {
      // Assert
      expect(err.message).toBe('putObject error');
      expect(s3Mock).toHaveReceivedCommand(PutObjectCommand);
    }
  });

  it('should upload the package to S3', async () => {
    // Arrange
    s3Mock.on(PutObjectCommand).resolves({});

    const options = {
      packageFilePath: 'package.zip',
      s3Bucket: 's3Bucket',
      s3Key: 's3Key',
    };

    // Act
    await uploadPackage(options);

    // Assert
    expect(s3Mock).toHaveReceivedCommand(PutObjectCommand);
  });
});
