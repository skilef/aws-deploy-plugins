# @aws-deploy-plugins/lambda

## 📦 Install

Install the plugin with your package manager of choice (npm, yarn, pnpm, etc).

```bash
npm install --save-dev @aws-deploy-plugins/lambda
```

## 🚀 Usage

Add a deployment target in your lambda's `project.json` and use the `@aws-deploy-plugins/lambda:deploy` executor.

For example:

```json
    "deploy": {
      "executor": "@aws-deploy-plugins/lambda:deploy",
      "options": {
        "functionName": "my-lambda-function",
      }
    }
```

## Options

| Parameter                  | Type    | Description                                                                                                                                            |
| -------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `functionName`             | string  | (Optional) The name of the lambda function. Defaults to the project name.                                                                              |
| `awsRegion`                | string  | (Optional) The Lambda's AWS region. If not specified, the default credential provider chain is used.                                                   |
| `assumeRoleARN`            | string  | (Optional) The ARN of the role to assume before making any AWS API call. If not specified, the default credential provider chain is used.              |
| `s3Bucket`                 | string  | (Optional) The name of the S3 bucket to which the deployment package will be uploaded. If not specified, will deploy the package directly (50 MB max). |
| `s3Key`                    | string  | (Optional) The key of the S3 object to which the deployment package will be uploaded. Defaults to `<project-name>.zip`.                                |
| `buildDirectoryPath`       | string  | (Optional) The path to the build directory (.js files). Defaults to the project's `build` target's output directory.                                   |
| `compressionLevel`         | number  | (Optional) The compression level of the deployment package. Defaults to `9`.                                                                           |
| `deleteLocalPackage`       | boolean | (Optional) Whether to delete the local package after the deployment. Defaults to `true`.                                                               |
| `packageFilePath`          | string  | (Optional) The path to the deployment package. Defaults to `<project-name>.zip`.                                                                       |
| `publish`                  | boolean | (Optional) Whether to publish the lambda function. Defaults to `false`.                                                                                |
| `cloudFrontDistributionId` | string  | (Optional) The ID of the CloudFront distribution to update after deployment. Use it for Lambda@Edge Defaults to `null`.                                |
| `cloudFrontEventType`      | enum    | (Optional) The type of CloudFront event to update after deployment. Use it for Lambda@Edge Defaults to `viewer-request`.                               |
