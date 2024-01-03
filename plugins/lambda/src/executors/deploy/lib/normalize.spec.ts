import { ExecutorContext } from '@nx/devkit';
import { DeployExecutorSchema } from '../schema';
import { normalizeOptions } from './normalize';

const context: ExecutorContext = {
  root: '/root',
  cwd: '/root',
  isVerbose: false,
  projectName: 'my-project',
  workspace: {
    version: 2,
    projects: {
      'my-project': {
        root: 'apps/my-project',
        targets: {
          build: {
            executor: '@nx/node:build',
            options: {
              outputPath: 'dist/apps/my-project',
            },
          },
        },
      },
    },
  },
  projectsConfigurations: {
    version: 2,
    projects: {
      'my-project': {
        root: 'apps/my-project',
        targets: {
          build: {
            executor: '@nx/node:build',
            options: {
              outputPath: 'dist/apps/my-project',
            },
          },
        },
      },
    },
  },
};

describe('normalizeOptions', () => {
  it('should use defaults if not arguments supplied', () => {
    const options: DeployExecutorSchema = {
      publish: false,
      compressionLevel: 9,
      deleteLocalPackage: true,
      cloudFrontEventType: 'viewer-request',
    };

    const result = normalizeOptions(options, context);

    expect(result).toEqual({
      functionName: 'my-project',
      deleteLocalPackage: true,
      packageFilePath: '/root/apps/my-project/my-project.zip',
      buildDirectoryPath: '/root/dist/apps/my-project',
      s3Key: 'my-project.zip',
      compressionLevel: 9,
      s3Bucket: undefined,
      assumeRoleArn: undefined,
      awsRegion: undefined,
      publish: false,
      cloudFrontDistributionId: undefined,
      cloudFrontEventType: 'viewer-request',
      isUploadToS3: false,
      isAssumeRole: false,
      isLambdaEdge: false,
    });
  });

  it('should use function name supplied', () => {
    const options: DeployExecutorSchema = {
      functionName: 'my-function',
      publish: false,
      compressionLevel: 9,
      deleteLocalPackage: true,
      cloudFrontEventType: 'viewer-request',
    };

    const result = normalizeOptions(options, context);

    expect(result).toEqual({
      functionName: 'my-function',
      deleteLocalPackage: true,
      packageFilePath: '/root/apps/my-project/my-project.zip',
      buildDirectoryPath: '/root/dist/apps/my-project',
      s3Key: 'my-project.zip',
      compressionLevel: 9,
      s3Bucket: undefined,
      assumeRoleArn: undefined,
      awsRegion: undefined,
      publish: false,
      cloudFrontDistributionId: undefined,
      cloudFrontEventType: 'viewer-request',
      isUploadToS3: false,
      isAssumeRole: false,
      isLambdaEdge: false,
    });
  });

  it('should use s3 bucket supplied', () => {
    const options: DeployExecutorSchema = {
      s3Bucket: 'my-bucket',
      publish: false,
      compressionLevel: 9,
      deleteLocalPackage: true,
      cloudFrontEventType: 'viewer-request',
    };

    const result = normalizeOptions(options, context);

    expect(result).toEqual({
      functionName: 'my-project',
      deleteLocalPackage: true,
      packageFilePath: '/root/apps/my-project/my-project.zip',
      buildDirectoryPath: '/root/dist/apps/my-project',
      s3Key: 'my-project.zip',
      compressionLevel: 9,
      s3Bucket: 'my-bucket',
      assumeRoleArn: undefined,
      awsRegion: undefined,
      publish: false,
      cloudFrontDistributionId: undefined,
      cloudFrontEventType: 'viewer-request',
      isUploadToS3: true,
      isAssumeRole: false,
      isLambdaEdge: false,
    });
  });

  it('should use assume role supplied', () => {
    const options: DeployExecutorSchema = {
      assumeRoleArn: 'my-role',
      publish: false,
      compressionLevel: 9,
      deleteLocalPackage: true,
      cloudFrontEventType: 'viewer-request',
    };

    const result = normalizeOptions(options, context);

    expect(result).toEqual({
      functionName: 'my-project',
      deleteLocalPackage: true,
      packageFilePath: '/root/apps/my-project/my-project.zip',
      buildDirectoryPath: '/root/dist/apps/my-project',
      s3Key: 'my-project.zip',
      compressionLevel: 9,
      s3Bucket: undefined,
      assumeRoleArn: 'my-role',
      awsRegion: undefined,
      publish: false,
      cloudFrontDistributionId: undefined,
      cloudFrontEventType: 'viewer-request',
      isUploadToS3: false,
      isAssumeRole: true,
      isLambdaEdge: false,
    });
  });
});
