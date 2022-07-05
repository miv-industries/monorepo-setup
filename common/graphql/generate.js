#!/usr/bin/env node

const { generate } = require("@graphql-codegen/cli");

(async function doSomething() {
  const [path] = process.argv.reverse();
  await generate(
    {
      schema: __dirname + "/core.graphql",
      documents: __dirname + `/../../${path}/**/*.graphql`,
      overwrite: true,
      generates: {
        [__dirname + `/../../${path}/graphql.tsx`]: {
          plugins: [
            "typescript",
            "typescript-operations",
            "typescript-react-apollo",
          ],
        },
      },
    },
    true
  );
})();
