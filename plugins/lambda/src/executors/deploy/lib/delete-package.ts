import { unlink } from 'fs/promises';

export type DeletePackageOptions = {
  packageFilePath: string;
};

export async function deletePackageFile(
  options: DeletePackageOptions
): Promise<void> {
  return unlink(options.packageFilePath);
}
