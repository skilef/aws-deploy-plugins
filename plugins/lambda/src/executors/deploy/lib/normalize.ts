import { ExecutorContext } from '@nx/devkit';
import {
  DeployExecutorSchema,
  NormalizedDeployExecutorSchema,
} from '../schema';

export function normalizeOptions(
  _options: DeployExecutorSchema,
  context: ExecutorContext
): NormalizedDeployExecutorSchema {
  const projectConfigurations =
    context.projectsConfigurations.projects[context.projectName];

  const defaultOptions: NormalizedDeployExecutorSchema = {
    functionName: context.projectName,
    deleteLocalPackage: true,
    packageFilePath: `${context.root}/${projectConfigurations.root}/${context.projectName}.zip`,
    buildDirectoryPath: `${context.root}/${projectConfigurations.targets['build'].options.outputPath}`,
    s3Key: `${context.projectName}.zip`,
    compressionLevel: 9,
    s3Bucket: undefined,
    assumeRoleArn: undefined,
    awsRegion: undefined,
    publish: false,
    isUploadToS3: false,
    isAssumeRole: false,
  };

  let options: NormalizedDeployExecutorSchema = defaultOptions;
  options = Object.assign(options, _options);

  if (options.s3Bucket) {
    options.isUploadToS3 = true;
  }

  if (options.assumeRoleArn) {
    options.isAssumeRole = true;
  }

  return options;
}
