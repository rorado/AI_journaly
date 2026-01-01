"use client";

import LoadingSVG from "@/components/LoadingSVG";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAutosave } from "react-autosave";

type JournalEntry = {
  id: string;
  title?: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
};

const SingleEntry = () => {
  const { id } = useParams<{ id: string }>();

  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotFound, setShowNotFound] = useState(false);

  const [editedEntry, setEditedEntry] = useState("");
  const [isLoadingSave, setIsLoadingSave] = useState(false);

  // track last saved value
  const lastSavedRef = useRef<string>("");

  const analyzes = [
    { name: "Sentiment Analysis", result: "Positive", mood: "Positive" },
  ];
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

  useAutosave({
    data: editedEntry,
    onSave: async (value) => {
      if (value === lastSavedRef.current) return;

      setIsLoadingSave(true);

      try {
        await fetch(`/api/journal/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: value }),
        });

        lastSavedRef.current = value;
      } catch (err) {
        console.error("Error autosaving journal entry:", err);
      } finally {
        setIsLoadingSave(false);
      }
    },
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSVG />
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

  if (!entry) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSVG />
      </div>
    );
  }

  return (
    <div className="px-8  mx-auto w-full h-full">
      {/* <header className="mb-8">
        <h1 className="text-[40px] font-thin tracking-tight">
          {entry.title || "Untitled Entry"}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {new Date(entry.createdAt).toLocaleDateString()}{" "}
          {new Date(entry.createdAt).toLocaleTimeString()}
        </p>
      </header> */}
      <div className="flex gap-10 md:gap-16 lg:gap-20 justify-between w-full lg:flex-row flex-col h-full">
        <div className="p-12 w-full">
          <article className="px-6 py-6 border rounded-lg shadow-sm bg-white dark:bg-gray-800 overflow-hidden h-60">
            <div className="mb-2 text-xs text-gray-400">
              {isLoadingSave ? "Saving..." : "Saved"}
            </div>

            <textarea
              className="w-full h-30 bg-transparent border-0 focus:ring-0 resize-none outline-none text-gray-800 dark:text-gray-200 leading-relaxed"
              value={editedEntry}
              onChange={(e) => setEditedEntry(e.target.value)}
            />

            <footer className="mt-6 text-xs text-gray-500 flex justify-end">
              Updated {new Date(entry.updatedAt).toLocaleDateString()}
            </footer>
          </article>
        </div>
        <div className="w-full">
          <div className="border-l border-2 border-gray-700">
            <div className="bg-gray-700 p-3.5">
              <h2 className="text-2xl font-semibold mb-4">Analyses</h2>
            </div>
            <ul className="list-none p-0 m-0">
              {analyzes.map((analysis) => (
                <li key={analysis.name} className="relative ">
                  <h3 className="text-lg font-medium  p-6 flex items-center gap-2 border-b border-gray-700">
                    {analysis.name}
                  </h3>
                  <h3 className="text-lg font-medium  p-6 flex items-center gap-2 border-b border-gray-700">
                    {analysis.mood}
                  </h3>
                  <h3 className="text-lg font-medium  p-6 flex items-center gap-2 border-b border-gray-700">
                    {analysis.result}
                  </h3>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleEntry;
