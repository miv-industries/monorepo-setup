import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../../../../.env" });
import { printSchema } from "graphql";
import "reflect-metadata";
import "source-map-support/register";
import { schema } from "@functions/graphql/schema";

console.log(printSchema(schema));
