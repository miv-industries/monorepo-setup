import { prisma } from "@functions/utils/prisma";
import {
  ApolloError,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core"
import { ApolloServer, AuthenticationError } from "apollo-server-lambda";
import { schema } from './schema';
import { GraphQLContext } from "./utils/context";
import "reflect-metadata";

export const main = (event, context, callback) => {
  console.log("Graphql handler called")
  // https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-aws-lambda#a-note-on-deploying-graphql-servers-to-aws-lambda
  context.callbackWaitsForEmptyEventLoop = false;

  const server = new ApolloServer({
    schema,
    // TODO Remove because auto-removed in production ?
    introspection: true, 
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    csrfPrevention: true,  // see below for more about this
    cache: "bounded",
    context: async (obj): Promise<GraphQLContext> => {
      const context: GraphQLContext = {
        //userId: null, // we dont have a user for now so we kinda ignore this
        prisma,
        //email: null, // or an email so we ignore
        //appId: obj.express.req.headers["x-app-id"] as string, // or app id
        //authorizationToken: null, or authorization
        lambdaContext: obj,
      };
      /* TODO no authorization for now will be added later
      const authorization = obj?.express?.req?.headers?.authorization;
      if (authorization) {
        const [authotizationType, authorizationToken] =
          authorization.split(" ") || "";
        if (authotizationType && authorizationToken) {
          context.authorizationToken = authorizationToken;
          if (authotizationType === "Bearer") {
            try {
              const payload = verify(
                authorizationToken,
                JWT_SECRET
              ) as UserToken;
              if (payload && payload.sub && payload.email) {
                context.userId = payload.sub;
                context.email = payload.email;
              }
            } catch (error) {
              throw new AuthenticationError(error.message);
            }
          } // else type is NextAuth
        }
      }
      */
      return context;
    },

    // Output any error throw to the console
    formatError: (err: ApolloError) => {
      console.log(JSON.stringify(err, null, 3));
      return err;
    },
  });
  const handler = server.createHandler({
    expressGetMiddlewareOptions: { bodyParserConfig: { limit: "2mb" }, cors:false },
  });
  
  return handler(event, context, callback);
};