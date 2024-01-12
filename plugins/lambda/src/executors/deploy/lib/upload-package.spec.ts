import { uploadPackage } from './upload-package';
import { readFile } from 'fs/promises';
import { S3 } from '@aws-sdk/client-s3';

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));

jest.mock('@aws-sdk/client-s3', () => ({
  S3: jest.fn().mockImplementation(() => ({
    putObject: jest.fn(),
  })),
}));

describe('uploadPackage', () => {
  it('should throw if readFile throws', () => {
    // Arrange
    (readFile as jest.Mock).mockRejectedValueOnce(new Error('readFile error'));
    const options = {
      packageFilePath: 'packageFilePath',
      s3Bucket: 's3Bucket',
      s3Key: 's3Key',
    };

    return expect(uploadPackage(options)).rejects.toThrow('readFile error');
  });

  it('should reject if s3.putObject rejects', () => {
    // Arrange
    (readFile as jest.Mock).mockResolvedValueOnce('packageContents');
    const putObjectMock = jest
      .fn()
      .mockRejectedValueOnce(new Error('putObject error'));
    (S3 as jest.Mock).mockImplementationOnce(() => ({
      putObject: putObjectMock,
    }));
    const options = {
      packageFilePath: 'packageFilePath',
      s3Bucket: 's3Bucket',
      s3Key: 's3Key',
    };

    return expect(uploadPackage(options)).rejects.toThrow('putObject error');
  });
});
