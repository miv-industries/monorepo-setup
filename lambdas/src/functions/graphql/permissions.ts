import { allow, deny, rule, shield } from "graphql-shield";
import { GraphQLContext } from "./utils/context";

// Here we will protect the ""endpoints""** or graphql querries and mutations in our case from unauthorized users for example

const isAuthenticated = rule()((_parent, _args, context: GraphQLContext) => {
  //return context.userId !== null; for now we dont have auth
  return true
});

const isAdmin = rule()((_parent, _args, context: GraphQLContext) => {
  //return context.userId !== null && context.email?.endsWith("@mivdv.net"); 
  return false // no admins yet we dont care for this right now 
});

export const queryPermissions = {
  "*": allow,
  //getNftExportPrice: isAuthenticated, // for example

};

export const mutationPermissions = {
  "*": allow,
   //uploadProfilePicture: isAuthenticated, // for example
};

export const permissions = shield(
  {
    Query: queryPermissions,
    Mutation: mutationPermissions,
  },
  {
    fallbackRule: allow,
    allowExternalErrors: true,
  }
);
