import { createPackage } from './lib/create-package';
import { normalizeOptions } from './lib/normalize';
import { DeployExecutorSchema } from './schema';
import { ExecutorContext, logger } from '@nx/devkit';
import { assumeRole } from './lib/assume-role';
import { uploadPackage } from './lib/upload-package';
import { updateFunction } from './lib/update-function';
import { deletePackageFile } from './lib/delete-package';

export default async function runExecutor(
  _options: DeployExecutorSchema,
  context: ExecutorContext
) {
  try {
    const options = normalizeOptions(_options, context);

    logger.log(` 📦 Creating the package at ${options.packageFilePath}`);

    await createPackage(options);

    if (options.isAssumeRole) {
      logger.log(` 👤 Assuming role ${options.assumeRoleArn}`);
      options.credentials = await assumeRole(options);
    }

    if (options.isUploadToS3) {
      logger.log(` 🚀 Uploading the package to S3 bucket ${options.s3Bucket}`);
      await uploadPackage(options);
    }

    logger.log(` Updating the lambda function ${options.functionName}`);
    await updateFunction(options);

    if (options.deleteLocalPackage) {
      logger.log(` Deleting the local package ${options.packageFilePath}`);
      await deletePackageFile(options);
    }

    return {
      success: true,
    };
  } catch (error) {
    logger.error(error);
    return {
      success: false,
      error: error.message,
    };
  }
}
