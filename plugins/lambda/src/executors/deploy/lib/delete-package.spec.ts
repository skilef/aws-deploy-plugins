import { deletePackageFile } from './delete-package';
import * as mockFs from 'mock-fs';
import { existsSync } from 'fs';

describe('deletePackage', () => {
  beforeEach(() => {
    mockFs({
      'package.zip': 'packageContents',
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  it('should should delete the package file', async () => {
    // Arrange
    const packageFilePath = 'package.zip';
    // Act
    await deletePackageFile({
      packageFilePath,
    });

    // Assert
    expect(existsSync(packageFilePath)).toBe(false);
  });

  it('should throw an error if the package file does not exist', async () => {
    // Arrange
    const packageFilePath = 'wrong_package.zip';

    expect.assertions(1);

    try {
      // Act
      await deletePackageFile({
        packageFilePath,
      });
    } catch (error) {
      // Assert
      expect(error.message).toMatch('no such file or directory');
    }
  });
});
