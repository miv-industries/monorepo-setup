import { prisma } from "@functions/utils/prisma";
import { Arg, Args, Ctx, Info, Mutation, Query, Resolver } from "type-graphql";
import { GraphQLResolveInfo } from "graphql";
import { GraphQLContext } from "../utils/context";

import {
  Todo,
  TodoArgs,
  ToggleArgs
}
 from "./TodoTypes";
 import { PrismaClient } from "@prisma/client";

export { Todo };

 import { dataloader } from "../utils/dataloader";
import { transformDocument } from "@prisma/client/runtime";
import { doesNotMatch } from "assert";

 @Resolver(Todo)
 export class TodoResolver {
  @Query(() => Todo)
  async getTodo(
    @Arg("id", { nullable: true }) id: string,
    @Arg("text", { nullable: true }) text: string,
    @Arg("done", { nullable: true }) done: boolean,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: GraphQLContext
  ): Promise<Todo> {
    if (!id && !text) {
      throw new Error("Yikes! Must give one argument: id or text.")
    }
    const todo = await prisma.todo.findFirst({
      where: id ? { id } : { text },
        select: {
          id: true,
          text: true,
          done: true,

        }
      })  
    return todo;
  }

  @Query(() => [Todo])
  async getTodos(
    @Arg("id", { nullable: true }) id: string,
    @Arg("text", { nullable: true }) text: string,
    @Arg("done", { nullable: true }) done: boolean,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: GraphQLContext
  ): Promise<Todo[]> {

    const todo = await prisma.todo.findMany() 
    console.log(todo, "returning from gettodos") 
    return todo;
  }

  @Mutation(() => Todo)
  async addTodo(
    @Args()
    input: TodoArgs,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: GraphQLContext
  ): Promise<Todo> {
    // TODO check user permission to add a product RBAC ADMIN
    return await prisma.todo.create({
      data: {
        ...input,
      },
     
    });
  }
  
  @Mutation(() => Todo)
  async toggleTodo(
    @Args()
    input: ToggleArgs,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: GraphQLContext
  ): Promise<Todo> {
    // TODO check user permission to add a product RBAC ADMIN
    return await prisma.todo.update({
      where: {...input},
      data: {
        done: true,
      },
     
    });
    //prisma.$queryRaw`update "Todo" set "done" = not "done" where "id" = ${input.done} returning *`
  } 
 }
