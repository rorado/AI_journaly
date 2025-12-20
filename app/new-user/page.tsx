import { prisma } from "@/utils/db";
import { styles } from "@/utils/styles";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const createNewUser = async () => {
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
  redirect("/journaly");
};

const WelcomeNewUser: React.FC = async () => {
  await createNewUser();
  return <div style={styles.container}>loading...</div>;
};
export default WelcomeNewUser;
