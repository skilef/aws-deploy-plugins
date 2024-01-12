import { deletePackageFile } from './delete-package';
import { unlink } from 'fs/promises';

jest.mock('fs/promises', () => ({
  unlink: jest.fn(),
}));

describe('deletePackage', () => {
  it('should throw an error if unlink fails', () => {
    const error = new Error('unlink failed');
    (unlink as jest.Mock).mockRejectedValue(error);
    return expect(
      deletePackageFile({ packageFilePath: 'foo' })
    ).rejects.toThrow();
  });

  it('should succeed if unlink succeeds', () => {
    (unlink as jest.Mock).mockResolvedValue(undefined);
    return expect(
      deletePackageFile({ packageFilePath: 'foo' })
    ).resolves.toBeUndefined();
  });
});
