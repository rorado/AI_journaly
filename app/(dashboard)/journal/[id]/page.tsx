"use client";

import LoadingSVG from "@/components/LoadingSVG";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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
    <div className="px-8 max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-[40px] font-thin tracking-tight">
          {entry.title || "Untitled Entry"}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {new Date(entry.createdAt).toLocaleDateString()}{" "}
          {new Date(entry.createdAt).toLocaleTimeString()}
        </p>
      </header>

      <article className="px-6 py-6 border rounded-lg shadow-sm bg-white dark:bg-gray-800 max-w-prose overflow-hidden">
        <p className="whitespace-pre-line leading-relaxed text-gray-800 dark:text-gray-200 wrap-break-word">
          {entry.content}
        </p>

        <footer className="mt-6 text-xs text-gray-500 dark:text-gray-400 flex justify-end">
          Updated {new Date(entry.updatedAt).toLocaleDateString()}
        </footer>
      </article>
    </div>
  );
};

export default SingleEntry;
