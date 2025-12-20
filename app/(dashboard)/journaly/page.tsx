import { getUserByClerckID } from "@/utils/auth";
import { prisma } from "@/utils/db";

const getEntry = async () => {
  const user = await getUserByClerckID();
  const entry = await prisma.journal.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return entry;
};

const journalPage = async () => {
  const entries = await getEntry();

  return (
    <div>
      {entries.map((entry) => (
        <div>{entry.title}</div>
      ))}
    </div>
  );
};

export default journalPage;
