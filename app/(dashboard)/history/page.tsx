import { LineChart } from "@/components/historyCharts/lineChart";
import { getUserByClerckID } from "@/utils/auth";
import { prisma } from "@/utils/db";

const HistoryPage = async () => {
  const user = await getUserByClerckID();
  const Entries = await prisma.journal.findMany({
    where: {
      userId: user?.id,
    },
    orderBy: {
      createdAt: "asc",
    },
    include: { analysis: true },
  });

  return (
    <div className="p-8">
      <div>
        <h1 className="text-2xl font-semibold mb-4">History Page</h1>
        <p>explore your journal entries over time</p>
      </div>

      <div>
        <div className="mt-8 w-full h-150">
          <LineChart Entries={Entries} />
        </div>
      </div>
    </div>
  );
};
export default HistoryPage;
