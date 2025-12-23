"use server";

import { prisma } from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const createNewUser = async () => {
  const user = await currentUser();
  console.log("Current User:", user);
  if (user) {
    const exit = await prisma.user.findUnique({
      where: { clerkId: user?.id },
    });
    if (!exit) {
      await prisma.user.create({
        data: {
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress || "",
          image: user.imageUrl || "",
          name: user.fullName || "",
        },
      });
    }
  }
  redirect("/journal");
};
