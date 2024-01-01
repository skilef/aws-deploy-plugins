import { ExecutorContext } from '@nx/devkit';
import {
  DeployExecutorSchema,
  NormalizedDeployExecutorSchema,
} from '../schema';

/**
 * Normalizes the options for the deploy executor.
 * @param _options The options provided to the deploy executor.
 * @param context The context of the deploy executor.
 * @returns The normalized options.
 */
export function normalizeOptions(
  _options: DeployExecutorSchema,
  context: ExecutorContext
): NormalizedDeployExecutorSchema {
  const projectConfigurations =
    context.projectsConfigurations.projects[context.projectName];

  const options: NormalizedDeployExecutorSchema = {
    functionName: _options.functionName ?? context.projectName,
    awsRegion: _options.awsRegion,
    assumeRoleArn: _options.assumeRoleArn,
    s3Bucket: _options.s3Bucket,
    s3Key: _options.s3Key ?? `${context.projectName}.zip`,
    packageFilePath:
      _options.packageFilePath ??
      `${context.root}/${projectConfigurations.root}/${context.projectName}.zip`,
    buildDirectoryPath:
      _options.buildDirectoryPath ??
      `${context.root}/${projectConfigurations.targets['build'].options.outputPath}`,
    publish: _options.publish,
    compressionLevel: _options.compressionLevel,
    deleteLocalPackage: _options.deleteLocalPackage,
    isUploadToS3: _options.s3Bucket ? true : false,
    isAssumeRole: _options.assumeRoleArn ? true : false,
  };

  return options;
}
