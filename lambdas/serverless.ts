import type { AWS } from '@serverless/typescript';
import "reflect-metadata";
import graphql from '@functions/graphql';

import {
  MIVDV_ENV
} from "@functions/utils/environment";

const serverlessConfiguration: AWS = {
  service: 'lambdas',
  configValidationMode: "error",
  frameworkVersion: '3',
  useDotenv: true,
  plugins: [
    'serverless-esbuild',
    "serverless-dotenv-plugin",
    "serverless-offline"
  ],
  custom: {
    esbuild: {
      platform: "node",
      target: "node16",
      packager: "pnpm",
      packagePath: "./package.json",
      bundle: true,
      minify: false,
      keepOutputDirectory: true,
      exclude: ["aws-sdk", "electron"],
      plugins: "./esbuild.plugins.js",
    },
  },
  provider: {
    name: "aws",
    stage: MIVDV_ENV,
    stackTags: {
      project: "mivdv",
      env: MIVDV_ENV,
    },
    region: "eu-central-1",
    runtime: "nodejs16.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      STAGE: MIVDV_ENV,
    },
  },
  functions: {
    graphql: {
      ...graphql,
      name: `mivdv-${MIVDV_ENV}-graphql`,
    }
  },
};

module.exports = serverlessConfiguration;
