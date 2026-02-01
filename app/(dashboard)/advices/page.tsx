"use client";

import { useEffect, useState } from "react";

const AdvicesPage = () => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvice = async () => {
    try {
      const res = await fetch("/api/advices");
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      console.log("Fetched Advice Data:", data);
      setAdvice(data.advice);
    } catch (err: any) {
      setError(err.message || "Failed to fetch advice");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvice();
  }, []);

  return (
    <div className="px-8 pt-6 w-full overflow-y-auto h-screen">
      <div className="mb-6 px-6 py-1.5">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl my-2 font-thin mx-0.5">
            Advice to make you better
          </h1>
        </div>
      </div>

      <div className="px-6">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {advice && !loading && !error && (
          <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 lg:max-w-3xl mx-auto">
            {advice.split("\n").map((line, idx) => (
              <p key={idx} className="text-gray-800 mb-2 leading-relaxed">
                {line}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvicesPage;
