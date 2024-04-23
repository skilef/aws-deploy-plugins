import { updateFunction } from './update-function';
import {
  LambdaClient,
  UpdateFunctionCodeCommand,
} from '@aws-sdk/client-lambda';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import * as mockFs from 'mock-fs';

const lambdaMock = mockClient(LambdaClient);

describe('updateFunction', () => {
  beforeEach(() => {
    mockFs({
      'package.zip': 'packageContents',
    });
  });

  afterEach(() => {
    lambdaMock.reset();
    mockFs.restore();
  });

  it('should fail if updating from local file and the file is missing', async () => {
    // Arrange
    const options = {
      functionName: 'functionName',
      packageFilePath: 'wrong_package.zip',
      publish: true,
    };

    expect.assertions(2);

    try {
      // Act
      await updateFunction(options);
    } catch (err) {
      // Assert
      expect(err.message).toMatch('no such file or directory');
      expect(lambdaMock).not.toHaveReceivedAnyCommand();
    }
  });

  it('should update function code from local file', async () => {
    // Arrange
    const options = {
      functionName: 'functionName',
      packageFilePath: 'package.zip',
      publish: true,
    };

    // Act
    await updateFunction(options);

    // Assert
    expect(lambdaMock).toHaveReceivedCommand(UpdateFunctionCodeCommand);
  });

  it('should update function code from S3', async () => {
    // Arrange
    const options = {
      functionName: 'functionName',
      s3Bucket: 's3Bucket',
      s3Key: 's3Key',
      publish: true,
    };

    // Act
    await updateFunction(options);

    // Assert
    expect(lambdaMock).toHaveReceivedCommand(UpdateFunctionCodeCommand);
  });
});
