import { buildSchemaSync, NonEmptyArray } from "type-graphql";
import { TodoResolver } from "./Todo/TodoResolver";
import { applyMiddleware } from "graphql-middleware";
import { permissions } from "./permissions";
export const resolvers = [
   TodoResolver,
] as NonEmptyArray<any>;

export const schema = applyMiddleware(
  buildSchemaSync({
    resolvers,
  }),
  permissions
);
