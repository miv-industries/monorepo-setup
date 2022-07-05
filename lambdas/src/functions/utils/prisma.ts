import { PrismaClient } from "@prisma/client";

// Allows us to log prisma errors when initializing the client
const getPrismaClient = () => {
  try {
    return new PrismaClient();
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
};

export const prisma = getPrismaClient();