import { createWriteStream, existsSync } from 'fs';
import { createPackage } from './create-package';
import archiver = require('archiver');

jest.mock('fs', () => ({
  createWriteStream: jest.fn(),
  existsSync: jest.fn(),
}));

jest.mock('archiver', () => {
  return jest.fn().mockImplementation(() => {
    return {
      pipe: jest.fn(),
      directory: jest.fn(),
      finalize: jest.fn(),
      on: jest.fn(),
    };
  });
});

describe('createPackage', () => {
  it('should throw an error if the build directory does not exist', async () => {
    const options = {
      packageFilePath: 'package-file-path',
      buildDirectoryPath: 'build-directory-path',
      compressionLevel: 1,
      publish: false,
      deleteLocalPackage: true,
    };

    (existsSync as jest.Mock).mockReturnValue(false);

    return expect(createPackage(options)).rejects.toThrow(/does not exist/);
  });

  it('should throw an error if there are errors with archiving', async () => {
    const options = {
      packageFilePath: 'package-file-path',
      buildDirectoryPath: 'build-directory-path',
      compressionLevel: 1,
      publish: false,
      deleteLocalPackage: true,
    };

    (existsSync as jest.Mock).mockReturnValue(true);

    (createWriteStream as jest.Mock).mockReturnValue({
      on: jest.fn().mockImplementation(() => {}),
    });

    (archiver as unknown as jest.Mock).mockReturnValue({
      pipe: jest.fn(),
      directory: jest.fn(),
      finalize: jest.fn(),
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === 'error') {
          callback(new Error('error'));
        }
      }),
    });

    return expect(createPackage(options)).rejects.toThrow(/Failed to create/);
  });

  it('should create a package if there are no errors with archiving', async () => {
    const options = {
      packageFilePath: 'package-file-path',
      buildDirectoryPath: 'build-directory-path',
      compressionLevel: 1,
      publish: false,
      deleteLocalPackage: true,
    };

    (existsSync as jest.Mock).mockReturnValue(true);

    (createWriteStream as jest.Mock).mockReturnValue({
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === 'close') {
          callback();
        }
      }),
    });

    return expect(createPackage(options)).resolves.toBeUndefined();
  });
});
