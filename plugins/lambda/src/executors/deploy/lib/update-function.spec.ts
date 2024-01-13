import { updateFunction } from './update-function';
import { readFile } from 'fs/promises';
import { Lambda } from '@aws-sdk/client-lambda';

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));

jest.mock('@aws-sdk/client-lambda', () => ({
  Lambda: jest.fn().mockImplementation(() => ({
    updateFunctionCode: jest.fn(),
  })),
}));

describe('updateFunction', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should read the package file if no s3 bucket is provided', () => {
    (readFile as jest.Mock).mockResolvedValueOnce('packageContents');

    (Lambda as jest.Mock).mockImplementationOnce(() => ({
      updateFunctionCode: jest.fn().mockResolvedValueOnce({
        FunctionArn: 'FunctionArn',
      }),
    }));

    const options = {
      functionName: 'functionName',
      packageFilePath: 'packageFilePath',
      publish: true,
    };

    expect(updateFunction(options)).resolves.toEqual({
      FunctionArn: 'FunctionArn',
    });

    expect(readFile).toHaveBeenCalledWith('packageFilePath');
  });

  it('should not read the package file if an s3 bucket is provided', () => {
    (Lambda as jest.Mock).mockImplementationOnce(() => ({
      updateFunctionCode: jest.fn().mockResolvedValueOnce({
        FunctionArn: 'FunctionArn',
      }),
    }));

    const options = {
      functionName: 'functionName',
      s3Bucket: 's3Bucket',
      s3Key: 's3Key',
      publish: true,
    };

    expect(updateFunction(options)).resolves.toEqual({
      FunctionArn: 'FunctionArn',
    });

    expect(readFile).not.toHaveBeenCalled();
  });

  it('should reject if updateFunctionCode rejects', () => {
    (readFile as jest.Mock).mockResolvedValueOnce('packageContents');

    (Lambda as jest.Mock).mockImplementationOnce(() => ({
      updateFunctionCode: jest.fn().mockRejectedValueOnce(new Error('error')),
    }));

    const options = {
      functionName: 'functionName',
      packageFilePath: 'packageFilePath',
      publish: true,
    };

    return expect(updateFunction(options)).rejects.toThrow('error');
  });
});
