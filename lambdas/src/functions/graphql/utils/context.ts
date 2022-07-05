import { LambdaContextFunctionParams } from "apollo-server-lambda/dist/ApolloServer";
import { PrismaClient } from "@prisma/client";

export class GraphQLContext {
  prisma: PrismaClient;
  //appId: string; // TODO will be needed when we add the commons folder and multiple app support in order to identify which app we are talking to
  lambdaContext: LambdaContextFunctionParams;
}