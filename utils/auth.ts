import { auth } from "@clerk/nextjs/server";
import { prisma } from "./db";

export const getUserByClerckID = async () => {
  const { userId } = await auth();
  const user = await prisma.user.findFirstOrThrow({
    where: { clerkId: userId || "" },
  });
  return user;
};
