import { unlink } from 'fs/promises';

export type DeletePackageOptions = {
  packageFilePath: string;
};

/**
 * Delete the package file
 * @param options Options for deleting the package file
 * @returns Promise that resolves when the package file is deleted
 */
export async function deletePackageFile(
  options: DeletePackageOptions
): Promise<void> {
  return unlink(options.packageFilePath);
}
