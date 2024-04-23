import { createPackage } from './create-package';
import * as mockFs from 'mock-fs';
import archiver = require('archiver');
import * as fs from 'fs';

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
  afterEach(() => {
    mockFs.restore();
  });

  it('should throw an error if the build directory does not exist', async () => {
    // Arrange

    mockFs();

    const options = {
      packageFilePath: 'package-file-path',
      buildDirectoryPath: 'build-directory-path',
      compressionLevel: 1,
      publish: false,
      deleteLocalPackage: true,
    };

    expect.assertions(1);

    try {
      // Act
      await createPackage(options);
    } catch (error) {
      // Assert
      expect(error.message).toMatch('does not exist');
    }
  });
  //
  it('should throw an error if there are errors with archiving', async () => {
    // Arrange
    mockFs({
      'build-directory-path': {
        'file1.txt': 'file1-content',
        'file2.txt': 'file2-content',
      },
    });

    const options = {
      packageFilePath: 'package-file-path',
      buildDirectoryPath: 'build-directory-path',
      compressionLevel: 1,
      publish: false,
      deleteLocalPackage: true,
    };

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

    expect.assertions(1);

    try {
      await createPackage(options);
    } catch (error) {
      // Assert
      expect(error.message).toMatch('error');
    }
  });

  it('should create a package if there are no errors with archiving', async () => {
    // Arrange
    mockFs({
      'build-directory-path': {
        'file1.txt': 'file1-content',
        'file2.txt': 'file2-content',
      },
    });

    const options = {
      packageFilePath: 'package-file-path',
      buildDirectoryPath: 'build-directory-path',
      compressionLevel: 1,
      publish: false,
      deleteLocalPackage: true,
    };

    jest.spyOn(fs, 'createWriteStream').mockReturnValue({
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === 'close') {
          callback();
        }
      }),
    } as unknown as fs.WriteStream);

    // Act

    await createPackage(options);

    // Assert
    expect(archiver).toHaveBeenCalledWith('zip', { zlib: { level: 1 } });
  });
});
