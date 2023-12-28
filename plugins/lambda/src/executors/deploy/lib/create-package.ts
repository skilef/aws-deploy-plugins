import { createWriteStream, existsSync } from 'fs';
import * as archiver from 'archiver';

export type CreatePackageOptions = {
  packageFilePath: string;
  buildDirectoryPath: string;
  compressionLevel?: number;
};

/**
 * Creates a package from the build directory.
 * @param options The options for creating the package.
 * @returns A promise that resolves when the package is created.
 * @throws An error if the build directory does not exist.
 * @throws An error if there are errors with archiving.
 */
export async function createPackage(
  options: CreatePackageOptions
): Promise<void> {
  if (!existsSync(options.buildDirectoryPath)) {
    throw new Error(
      `The build directory does not exist: ${options.buildDirectoryPath}`
    );
  }

  const zipFileStream = createWriteStream(options.packageFilePath);

  const archive = archiver('zip', {
    zlib: { level: options.compressionLevel },
  });

  archive.pipe(zipFileStream);
  archive.directory(options.buildDirectoryPath, 'src');
  archive.finalize();

  return new Promise<void>((resolve, reject) => {
    zipFileStream.on('close', () => {
      resolve();
    });
    archive.on('error', (err) => {
      reject(new Error(`Failed to create the package: ${err}`));
    });
  });
}
