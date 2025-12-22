import NewEntryCard from "@/components/NewEntryCard";
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
    <div className="px-8">
      <NewEntryCard />
      {entries.map((entry) => (
        <div key={entry.id}>
          <h2 className="text-2xl font-semibold mb-1">{entry.title}</h2>
          <p className="text-gray-700 mb-4">{entry.content}</p>
          <hr className="mb-4" />
        </div>
      ))}
    </div>
  );
};

export default journalPage;
