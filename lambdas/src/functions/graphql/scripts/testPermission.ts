import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../../../.env" });
import "reflect-metadata";
import "source-map-support/register";
import { queryPermissions, mutationPermissions } from "../permissions";
import { resolvers } from "@functions/graphql/schema";
import chalk from "chalk";

(async () => {
  const permissions = Object.keys(queryPermissions).concat(
    Object.keys(mutationPermissions)
  );

  const missingMethods = resolvers
    .map((re) => {
      return Object.getOwnPropertyNames(re.prototype);
    })
    .flat()
    .filter((p) => p !== "constructor" && !permissions.includes(p));

  missingMethods.forEach((method) => {
    console.log(chalk.blueBright(method), chalk.gray("has no permission"));
  });
})();
