"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  const { userId } = useAuth();
  const href = userId ? "/journal" : "/sign-in";

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 text-foreground">
      {/* 🖼️ Background Image */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/ai.jpg')" }}
      />

      {/* 🌑 Overlay */}
      <div className="absolute inset-0 bg-black/60 -z-10" />

      {/* Content */}
      <div className="flex flex-col gap-1.5 max-w-xl text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Journal</h1>

        <p className="text-lg">
          This is the best app for tracking your mood throughout your life. All
          you have to do is be honest.
        </p>

        <Link href={href} className="mt-6">
          <button className="px-6 py-3 rounded-lg cursor-pointer btn">
            Get started
          </button>
        </Link>
      </div>
    </div>
  );
}
