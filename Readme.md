# Monorepo Setup
## Goals

 I am going to attempt to create a monorepo template using:
 - [x] Basic project folder structure
 - [ ]  [a magic thing called pnpm](https://pnpm.io/),
 - [ ]  [AWS Node.js Typescript template](https://github.com/andrenbrandao/serverless-typescript-boilerplate) for the serverless setup, 
 - [ ]  Attempt to set up [Apollo server](https://itnext.io/how-to-build-a-serverless-apollo-graphql-server-with-aws-lambda-webpack-and-typescript-64a377739208 ) in a lambda function
 - [ ] Setup [Docker](https://docs.docker.com/get-docker/) with [Docker compose] (https://docs.docker.com/compose/install/compose-plugin/) & [Postgresql](https://hub.docker.com/_/postgres)
 - [ ] Set up [prisma](https://www.prisma.io/docs/getting-started/setup-prisma) for an ORM
## Project structure
```
/
	/apps/ for different frontend apps
	/common/ for the common stuff between apps
	/lambdas/ serverless backend
	/schemas/ graphql core schema
	
```
Each app will have its own package.json and local configs like .gitignore, tsconfig, even a README.md

## Issues encountered
 - [ ] null