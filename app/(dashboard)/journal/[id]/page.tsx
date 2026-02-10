/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Loading from "@/components/LoadingSVG";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const SingleEntry = () => {
  const { id } = useParams<{ id: string }>();

  const [entry, setEntry] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotFound, setShowNotFound] = useState(false);

  const [editedEntry, setEditedEntry] = useState("");
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [refetchData, setRefetchData] = useState(false);

  // track last saved value
  const lastSavedRef = useRef<string>("");

  const router = useRouter();

  /* ---------------- FETCH ENTRY ---------------- */
  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();
    let notFoundTimer: NodeJS.Timeout;

    const fetchEntry = async () => {
      try {
        setLoading(true);
        setError(null);
        setShowNotFound(false);

        const res = await fetch(`/api/journal/${id}`, {
          signal: controller.signal,
        });

        const json = await res.json();

        console.log("Response:", json.data);
        if (!res.ok) {
          throw new Error(json?.error || "Unable to load journal entry");
        }

        if (!json.data) {
          notFoundTimer = setTimeout(() => {
            setShowNotFound(true);
          }, 5000);
        } else {
          setEntry(json.data);
          setEditedEntry(json.data.content);
          lastSavedRef.current = json.data.content;
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();

    return () => {
      controller.abort();
      clearTimeout(notFoundTimer);
    };
  }, [id]);

  const handleUpdate = async () => {
    if (editedEntry === lastSavedRef.current) return;
    setIsLoadingSave(true);
    try {
      await fetch(`/api/journal/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editedEntry }),
      });
      lastSavedRef.current = editedEntry;
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating journal entry:", err);
    } finally {
      setIsLoadingSave(false);
      revalidateEntryData();
    }
  };

  const revalidateEntryData = async () => {
    setRefetchData(true);
    try {
      const res = await fetch(`/api/journal/${id}`);
      const json = await res.json();
      if (res.ok && json.data) {
        setEntry(json.data);
      }
    } catch (err) {
      console.error("Error refetching journal entry:", err);
    } finally {
      setRefetchData(false);
    }
  };

  if (loading || !entry) {
    return (
      <div>
        <header className="mt-8">
          <div>
            <button
              className="text-sm text-blue-500 hover:underline mb-4 block cursor-pointer ml-1.5"
              onClick={() => router.replace("/journal")}
            >
              &larr; Back to Entries
            </button>
          </div>
        </header>
        <div className="flex justify-center items-center h-full mt-40">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-8 py-10 text-red-500">
        <p className="text-lg font-medium">Something went wrong</p>
        <p className="mt-1 text-sm">{error}</p>
      </div>
    );
  }

  if (showNotFound) {
    return (
      <div className="px-8 py-10 text-gray-500">Journal entry not found.</div>
    );
  }

  return (
    <div className="px-8  mx-auto w-full h-fit">
      <header className="mb-8">
        <div>
          <button
            className="text-sm text-blue-500 hover:underline mb-4 block cursor-pointer"
            onClick={() => router.replace("/journal")}
          >
            &larr; Back to Entries
          </button>
        </div>
        {refetchData ? (
          <h1 className="text-[40px] font-thin tracking-tight animate-pulse bg-gray-300 h-10 w-1/4 rounded" />
        ) : (
          <h1 className="text-[40px] font-thin tracking-tight">
            {entry.title || "Untitled Entry"}
          </h1>
        )}

        <p className="text-sm text-gray-400 mt-1">
          {new Date(entry.createdAt).toLocaleDateString()}{" "}
          {new Date(entry.createdAt).toLocaleTimeString()}
        </p>
      </header>
      <div className="flex gap-10 md:gap-16 lg:gap-20 justify-between w-full lg:flex-row flex-col h-full">
        <div className="p-12 w-full h-fit">
          <article className="px-6 py-6 border rounded-lg shadow-sm  dark:bg-gray-800 overflow-hidden h-60 ">
            <div className="mb-2 text-xs text-gray-400 flex items-center gap-2">
              {isLoadingSave ? "Saving..." : "Saved"}
              {!isEditing && (
                <button
                  className="ml-2 text-blue-500 hover:text-blue-700 cursor-pointer"
                  title="Edit Entry"
                  onClick={() => setIsEditing(true)}
                  aria-label="Edit Entry"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 3.487a2.25 2.25 0 1 1 3.182 3.182L7.5 19.213l-4.182.455a.75.75 0 0 1-.826-.826l.455-4.182L16.862 3.487z"
                    />
                  </svg>
                </button>
              )}
            </div>

            <textarea
              className="w-full h-30 bg-transparent border-0 focus:ring-0 resize-none outline-none text-gray-800 dark:text-gray-200 leading-relaxed"
              value={editedEntry}
              onChange={(e) => setEditedEntry(e.target.value)}
              readOnly={!isEditing}
            />

            {isEditing && (
              <div className="flex justify-end mt-2">
                <button
                  className={`px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm ${isLoadingSave ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  onClick={handleUpdate}
                  disabled={isLoadingSave}
                >
                  {isLoadingSave ? "Updating..." : "Update Entry"}
                </button>
                <button
                  className={`ml-2 px-4 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm ${isLoadingSave ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  onClick={() => {
                    setEditedEntry(entry.content);
                    setIsEditing(false);
                  }}
                  disabled={isLoadingSave}
                >
                  Cancel
                </button>
              </div>
            )}

            <footer className="mt-6 text-xs text-gray-500 flex justify-end">
              Updated {new Date(entry.updatedAt).toLocaleDateString()}
            </footer>
          </article>
        </div>
        {refetchData ? (
          <div className="w-full">
            <div className="border-2 border-gray-700">
              <div className="bg-gray-700 p-4">
                <div className="h-6 w-1/3 bg-gray-600 rounded animate-pulse" />
              </div>

              <ul className="p-0 m-0">
                <li className="space-y-6 p-6">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-9 w-full bg-gray-700 rounded animate-pulse"
                    />
                  ))}
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="w-full h-fit">
            <div className="border-l border-2 border-gray-700 ">
              <div className="bg-gray-700 p-3.5">
                <h2 className="text-2xl font-semibold mb-4 text-white">
                  Analyses
                </h2>
              </div>
              <ul className="list-none p-0 m-0 ">
                <li className="relative ">
                  <h3 className="text-lg font-medium  p-6 flex items-center gap-2 border-b border-gray-700">
                    {entry.analysis?.summary}
                  </h3>
                  <h3 className="text-lg font-medium  p-6 flex items-center gap-2 border-b border-gray-700">
                    {entry.analysis?.mood} {"  "} {entry.analysis?.sticker}
                  </h3>
                  <h3
                    className={`text-lg font-medium  p-6 flex items-center gap-2 border-b border-gray-700 bg-${entry.analysis?.color}`}
                  >
                    {entry.analysis?.sentimentScore}
                  </h3>
                  <h3 className="text-lg font-medium  p-6 flex items-center gap-2 border-b border-gray-700">
                    {entry.analysis?.negative ? "Negative" : "Positive"}
                  </h3>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {refetchData ? (
        <div className="border border-gray-500 mt-20 rounded-lg bg-gray-700">
          <h2 className="text-2xl font-semibold p-4">Advice</h2>
          <div className="p-4">
            <div className="h-10 w-full bg-gray-600 rounded animate-pulse" />
          </div>
        </div>
      ) : (
        <div className="border border-gray-500 mt-20 rounded-lg bg-gray-700">
          <h2 className="text-2xl font-semibold p-4 text-white">Advice</h2>
          <div className="p-4">
            <p className="text-gray-100">{entry.analysis?.advice}</p>
          </div>
        </div>
      )}

      <div className="h-20 border-gray-500 px-4 flex items-center justify-center">
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Your Journal App. All rights
          reserved.
        </p>
      </div>
    </div>
  );
};

export default SingleEntry;
