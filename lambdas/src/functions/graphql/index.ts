import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "post",
        path: "graphql",
        cors: false,
      },
    },
    {
      http: {
        method: "get",
        path: "graphql",
        cors: false,
      },
    },
  ],
};
