"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function Home() {
  const { userId } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = 1;

    const handleTimeUpdate = () => {
      const remaining = video.duration - video.currentTime;

      if (remaining <= 2) {
        const progress = Math.max(remaining / 2, 0);
        video.playbackRate = 0.5 + progress * 0.5;
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  const href = userId ? "/journal" : "/sign-in";

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 text-foreground">
      {/* 🎥 Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover -z-10"
      >
        <source src="/videos/Ai_.mp4" type="video/mp4" />
      </video>

      {/* 🌑 Overlay */}
      <div className="absolute inset-0 bg-black/50 -z-10" />

      {/* Content */}
      <div className="flex flex-col gap-1.5 max-w-xl text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to my AI site</h1>

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
