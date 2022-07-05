import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../../../.env" });

export const getEnvironmentVariable = (name: string): string => {
  if (!process.env[name]) {
    throw new Error(
      `Missing environment variable ${name}. Please check your environment file.`
    );
  }
  return process.env[name];
};

export const IS_OFFLINE = process.env.IS_OFFLINE ? true : false;

//export const JWT_SECRET = getEnvironmentVariable("JWT_SECRET");

//export const JWT_ANALYTICS_SECRET = getEnvironmentVariable(
//  "JWT_ANALYTICS_SECRET"
//);
//export const DATABASE_ANALYTICS_URL = getEnvironmentVariable(
//  "DATABASE_ANALYTICS_URL"
//);

//export const JWT_REFRESH_SECRET = getEnvironmentVariable("JWT_REFRESH_SECRET");


export const FRONTEND_URL = getEnvironmentVariable("FRONTEND_URL");
export const API_URL = getEnvironmentVariable("API_URL");

export const masterUserUuid = "00000000-0000-0000-0000-000000000000";

export const MIVDV_ENV = getEnvironmentVariable("MIVDV_ENV");