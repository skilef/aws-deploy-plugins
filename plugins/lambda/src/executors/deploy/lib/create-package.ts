import { createWriteStream } from 'fs';
import * as archiver from 'archiver';

export type CreatePackageOptions = {
  packageFilePath: string;
  buildDirectoryPath: string;
  compressionLevel?: number;
};

export async function createPackage(
  options: CreatePackageOptions
): Promise<void> {
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
      reject(`Failed to create the package: ${err}`);
    });
  });
}
