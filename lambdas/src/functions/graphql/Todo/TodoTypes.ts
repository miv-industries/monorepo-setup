import { ArgsType, Field, ID, InputType, ObjectType } from "type-graphql";

@ObjectType("Todo")
export class Todo {
  @Field(() => ID, { nullable: true })
  id?: string;
  
  @Field(() => String, { nullable: true })
  text?: string;

  @Field(() => Boolean, { nullable: true })
  done?: boolean;
}

@ArgsType()
export class TodoArgs {
  @Field(() => String)
  text: string;
}

@ArgsType()
export class ToggleArgs {
  @Field(() => ID, { nullable: true })
  id?: string;
  
  @Field(() => String, { nullable: true })
  text?: string;

  @Field(() => Boolean, { nullable: true })
  done?: boolean;
}