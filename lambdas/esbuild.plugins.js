/* eslint-disable @typescript-eslint/no-var-requires */
const esbuildDecorators = require("@anatine/esbuild-decorators").esbuildDecorators;
const copy = require("esbuild-plugin-copy").default;

module.exports = [
  esbuildDecorators(),
  copy({
    resolveFrom: "cwd",
    assets: [
      {
        from: [
          `./node_modules/prisma/**/${
            process.env.MIVDV_ENV === "OFFLINE"
              ? "*query*"
              : "libquery_engine-rhel-openssl-1.0.x.so.node"
          }`,
        ],
        to: [".esbuild/.build/.prisma/client/*"],
      },
      {
        from: ["./prisma/schema.prisma"],
        to: [
          ".esbuild/.build/src/functions/graphql/schema.prisma",
          // and all the other functions we might want to build a schema for
        ],
      },
    ],
  }),
];
