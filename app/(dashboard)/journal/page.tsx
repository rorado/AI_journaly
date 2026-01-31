"use client";
import { Journal } from "@/generated/prisma/client";
import NewEntryCard from "@/components/entry/NewEntryCard";
import RefreshEntries from "@/components/entry/RefreshEntries";
import Link from "next/link";
import { useEffect, useState } from "react";
import Loading from "@/components/LoadingSVG";
import { useRouter } from "next/navigation";

const JournalPage = () => {
  const [entries, setEntries] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(false);

  const handlegGetEntry = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/journal", { method: "GET" });
      if (!res.ok) {
        setEntries([]);
        setLoading(false);
        return;
      }
      let json = null;
      try {
        json = await res.json();
      } catch (e) {
        setEntries([]);
        setLoading(false);
        return;
      }
      setEntries(Array.isArray(json?.data) ? json.data : []);
    } catch (e) {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handlegGetEntry();
  }, []);

  return (
    <div className="px-8">
      <div className="mb-6 px-6 py-1.5">
        <div className="flex justify-between items-center">
          <h1 className="text-[40px] my-2 font-thin">Journals</h1>
          <div className="flex items-center gap-2">
            <NewEntryCard handleReload={handlegGetEntry} />
            <RefreshEntries handleReload={handlegGetEntry} />
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center mt-20">
          <Loading />
        </div>
      ) : entries.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">
          No journal entries found. Start by adding a new entry!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
          {/* <Loading /> */}
          {entries.map((entry) => (
            <Link
              href={`/journal/${entry.id}`}
              key={entry.id}
              className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-all cursor-pointer hover:scale-105"
            >
              <h2 className="text-xl font-semibold mb-2 line-clamp-1">
                {entry.title}
              </h2>
              <p className="mb-4 line-clamp-2">{entry.content}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default JournalPage;
