import Prisma from "@prisma/client";

import {
  ArgumentNode,
  GraphQLResolveInfo,
  FieldNode,
  getNamedType,
} from "graphql";
import { SetRequired } from "type-fest";

// ! Set the max depth limit here !
const maxDepthLimit = 10;
// ! Set the max depth limit here !

// ! Set the max complexity limit here !
const maxComplexity = 200;
// ! Set the max complexity limit here !

type Models = {
  Todo: Prisma.Todo;
};

const { allFields, jsonFields, relationFields, relationListFields } =
  Prisma.Prisma.dmmf.datamodel.models.reduce(
    (acc, model) => {
      model.fields.forEach((field) => {
        acc.allFields[field.name] = true;
        if (field.type.startsWith("Json")) {
          acc.jsonFields[field.name] = true;
        }
        if (field.relationName) {
          acc[field.isList ? "relationListFields" : "relationFields"][
            field.name
          ] = true;
        }
      });
      return acc;
    },
    {
      allFields: {},
      jsonFields: {},
      relationFields: {},
      relationListFields: {},
    }
  );

type Argument = {
  name: string;
  kind: ArgumentNode["value"]["kind"];
  value: any;
};

const getAST = (ast, info) => {
  if (ast.kind === "FragmentSpread") {
    return info.fragments[ast.name.value];
  } else {
    return ast;
  }
};

const getArguments = (ast: FieldNode): Argument[] => {
  return ast.arguments!.map((argument) => {
    const valueNode = argument.value;

    const argumentValue =
      valueNode.kind !== "ListValue"
        ? valueNode.kind === "ObjectValue" && valueNode?.fields?.[0]?.name.value
          ? {
              // @ts-expect-error types are weird in graphql
              [valueNode.fields[0].name.value]: valueNode.fields[0].value.value,
            }
          : (valueNode as any).value
        : (valueNode as any).values.map((value) => value.value);

    return {
      name: argument.name.value,
      kind: argument.value.kind,
      value: argumentValue,
    };
  });
};

const getChildComplexity = (ast, field, parentComplexity: number): number => {
  const { name } = field;
  // Set the complexity defined in the graphql schema or set the complexity to one if it is a relation field.
  let complexity =
    field.extensions.complexity ||
    (relationFields[name] || relationListFields[name] ? 1 : 0);

  // If its a relation list multiply its complexity by its take argument
  if (relationListFields[name]) {
    const take = getArguments(ast).find((arg) => arg.name === "take");
    complexity = complexity * Number(take?.value || 10);
  }
  // Multiply the child complexity by its parent one
  complexity = complexity * parentComplexity;
  return complexity;
};

export const dataloader = <T extends Prisma.Prisma.ModelName>(
  rootInfo: GraphQLResolveInfo
): Record<"select", SetRequired<Models[T], keyof Models[T]>> => {
  let depth = 0;
  let complexity = 0;
  const flattenAST = (
    parent: FieldNode,
    info: GraphQLResolveInfo,
    typeDef,
    parentComplexity: number
  ) => {
    const selection = parent?.selectionSet?.selections || [];
    // If the field is a json we don't need to build a nested select on its properties as prisma don't allow this.
    // If the field does not have a selectionSet just return true to select it.
    if (jsonFields[parent.name.value] || !selection.length) {
      return true;
    }

    // @ts-expect-error union types don't work really well in the graphql-js repo
    if (selection.length && parent.kind !== "FragmentDefinition") {
      // increase the depth if the field has a selection set.
      depth++;
    }

    const fields = typeDef.getFields();

    return selection.reduce(
      (acc, ast) => {
        if (ast.kind === "Field") {
          const name = ast.name.value;

          // Return if the requested field is not in the prisma schema (a custom field resolver for example).
          if (!allFields[name]) {
            return acc;
          }

          const field = fields[name];
          const typeDef = getNamedType(field.type);

          // Get the ast complexity before traversing its children
          const childComplexity = getChildComplexity(
            ast,
            field,
            parentComplexity
          );

          // Recursively traverse the node
          acc.select[name] = flattenAST(ast, info, typeDef, childComplexity);

          // Parse arguments for pagination and other filters here
          if (ast.arguments?.length && acc.select[name]) {
            const args = getArguments(ast);

            args.forEach((arg) => {
              let transformedValue = arg.value;
              switch (arg.kind) {
                case "BooleanValue": {
                  transformedValue = Boolean(transformedValue);
                  break;
                }
                case "IntValue":
                case "FloatValue": {
                  transformedValue = Number(transformedValue);
                  break;
                }
                default: {
                  break;
                }
              }
              switch (arg.name) {
                default: {
                  acc.select[name][arg.name] = transformedValue;
                  break;
                }
                case "cursor": {
                  acc.select[name][arg.name] = { id: transformedValue };
                  break;
                }
              }
            });
          }

          // Increment the global complexity
          complexity = complexity + childComplexity;
          return acc;
        } else {
          return flattenAST(getAST(ast, info), info, typeDef, parentComplexity);
        }
      },
      { select: {} }
    );
  };

  // Get the root operation type and complexity
  let queryType;
  if (rootInfo.operation.operation === "mutation") {
    queryType = rootInfo.schema.getMutationType();
    // mutation have a heavier complexity
    complexity += 10;
  } else {
    queryType = rootInfo.schema.getQueryType();
  }
  const queryField = queryType.getFields()[rootInfo.fieldName];

  // Begin the graphqlResolveInfo traversal
  const select =
    rootInfo.fieldNodes.reduce(
      (_acc, ast) => {
        return flattenAST(ast, rootInfo, getNamedType(queryField.type), 1);
      },
      {
        select: {},
      }
    ) || {};

  // Prevent too complex queries
  if (complexity > maxComplexity) {
    throw new Error(
      `Your query (${rootInfo.fieldName}) is too complex (${complexity}). Please consider using smaller queries or paginating your requests. The max allowed complexity for a query is ${maxComplexity}`
    );
  }
  // Prevent too deep queries
  if (depth > maxDepthLimit) {
    throw new Error(
      `Your query (${rootInfo.fieldName}) is too deep (${depth}). Please consider using smaller queries. The max allowed depth for a query is ${maxDepthLimit}`
    );
  }

  return select;
};
