# Monorepo Setup
![image](https://user-images.githubusercontent.com/91548145/175075804-6f0c80d6-059f-4e2c-9410-39a38e14c3d0.png)
## Goals

 I am going to attempt to create a monorepo template using:
 - [x] Basic project folder structure
 - [x]  [a cursed thing called pnpm](https://pnpm.io/),
 - [x]  aws-nodejs-typescript Serverless framework `--template aws-nodejs-typescript` for the serverless setup, 
 - [ ]  Attempt to set up [Apollo server](https://itnext.io/how-to-build-a-serverless-apollo-graphql-server-with-aws-lambda-webpack-and-typescript-64a377739208 ) in a lambda function
 - [ ] Setup [Docker](https://docs.docker.com/get-docker/) with [Docker compose](https://docs.docker.com/compose/install/compose-plugin/) & [Postgresql](https://hub.docker.com/_/postgres)
 - [ ] Set up [prisma](https://www.prisma.io/docs/getting-started/setup-prisma) for an ORM
## Project structure
```
/
	/apps/ for different apps we might need
	/common/ for the common stuff between apps
	/lambdas/ serverless backend
	/schemas/ graphql core schema
	
```
Each app will have its own package.json and local configs like .gitignore, tsconfig, even a README.md

## Issues encountered
 - [x] Had to start from scratch cuz I was dumb and copy pasted
## Instructions (setup from 0 || 0 to hero) 
1) If you don't have the serverless cli tool install it via `npm install -g serverless`
2) Install pnpm if you don't have it installed already `npm install -g pnpm`  (oh the irony)
3) `serverless create --template aws-nodejs-typescript --path lambdas ` to create a serverless project from the template just under the lambdas folder
4) This may be confusing but each app will have its own package.json and when you will install you will do so over the monorepo and let pnpm handle everything else. For example lambdas will have its own package.json apps/app1, apps/app2 will also have their own package.json.
5) Now add this to the root package.json under /package.json and don't question my authorita
 ```
 {
  "name": "root",
  "private": true,
  "scripts": {
    "lambdas:dev": "pnpm --filter lambdas run dev",
    "lambdas:start": "pnpm --filter lambdas run start"
  }
} 
```
5) We are now ready to hit a recursive install for all the apps in the project via `pnpm recursive install`
6) We should now be set to go as far as pnpm and the project template are concerned
