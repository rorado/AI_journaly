"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export const options: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 3000,
    easing: "easeOutQuart",
  },
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Sentiment Score by Month",
    },
  },
  scales: {
    y: {
      min: -10,
      max: 10,
    },
  },
};

export function LineChart({ Entries }: { Entries: any[] }) {
  const data = {
    labels: Entries.map((entry) =>
      new Date(entry.createdAt).toLocaleString("en-US", {
        day: "numeric",
        month: "short",
      }),
    ),

    datasets: [
      {
        label: "Sentiment Score",
        data: Entries.map((entry) => entry.analysis?.sentimentScore ?? 0),
        borderColor: "rgb(21, 93, 252, 1)",
        backgroundColor: "rgba(21, 93, 252, 0.5)",
        tension: 0,
      },
    ],
  };

  return (
    <div className="h-125 lg:h-100 w-full">
      <Line
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
}
