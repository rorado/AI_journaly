"use client";

import { useState } from "react";
import ModalPortal from "../ModalPortal";
import { CgClose } from "react-icons/cg";

export default function NewEntryModel({
  toggle,
  isOpen,
  handleReload,
}: {
  toggle: () => void;
  isOpen: boolean;
  handleReload: () => any;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) {
        console.log("Response not ok:", res);
      }

      setTitle("");
      setContent("");
      handleReload();
    } catch (err) {
      setError("Failed to add journal entry");
    } finally {
      setLoading(false);
      toggle();
    }
  };

  return (
    <ModalPortal>
      <div
        className={`items-center fixed top-0 left-0 w-screen z-40 h-screen flex justify-center  bg-gray-800/50 text-slate-900 ${
          isOpen ? "flex" : "hidden"
        }`}
        onClick={toggle}
      >
        <div
          className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto w-full space-y-6"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-semibold ">New Entry</h2>
              <div>
                <CgClose
                  onClick={toggle}
                  className="cursor-pointer hover:scale-120 transition-transform duration-300"
                  size={24}
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-900 font-medium mb-2 block">
                Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-slate-100 w-full text-sm text-slate-900 px-4 py-3 rounded-md outline-0 border border-gray-200 focus:border-blue-600 focus:bg-transparent"
                placeholder="Entry title"
              />
            </div>

            {/* Content */}
            <div>
              <label className="text-sm text-slate-900 font-medium mb-2 block">
                Content
              </label>
              <textarea
                required
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="bg-slate-100 w-full text-sm text-slate-900 px-4 py-3 rounded-md outline-0 border border-gray-200 focus:border-blue-600 focus:bg-transparent resize-none"
                placeholder="Write your thoughts here..."
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="mt-12!">
              <button
                type="submit"
                disabled={loading}
                className={`w-full shadow-xl py-2.5 px-4 text-[15px] font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Saving..." : "Add Entry"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
}
