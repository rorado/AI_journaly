import { getUserByClerckID } from "@/utils/auth";
import { prisma } from "@/utils/db";

export const getEntries = async () => {
  const user = await getUserByClerckID();

  return prisma.journal.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
