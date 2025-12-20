import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();

  let href = userId ? "/journaly" : "/new-user";
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-4xl font-bold mb-4">Welcome to my Ai site</h1>
        <p>
          This is the best app for tracking your mood through out your life. All
          you have to do is be honest.
        </p>
        <Link href={href} className="mt-4">
          <button className="p-2 bg-blue-700 rounded-lg cursor-pointer hover:bg-blue-800">
            Get started
          </button>
        </Link>
      </div>
    </div>
  );
}
