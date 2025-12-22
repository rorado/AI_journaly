"use server";

import { prisma } from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";

export const createNewUser = async () => {
  const user = await currentUser();
  if (user) {
    const exit = await prisma.user.findUnique({
      where: { clerkId: user?.id },
    });
    if (!exit) {
      await prisma.user.create({
        data: {
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress || "",
        },
      });
    }
  }
};
