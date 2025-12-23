"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { OAuthStrategy } from "@clerk/types";
import { FcGoogle } from "react-icons/fc";

export default function SignInPage() {
  const { signIn, isLoaded } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;

    try {
      await signIn.create({ identifier: email, password });
      window.location.href = "/";
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || "Sign in failed");
    }
  };

  const signInWithOAuth = async (strategy: OAuthStrategy) => {
    if (!isLoaded || !signIn) return;

    signIn.authenticateWithRedirect({
      strategy,
      redirectUrl: "/sign-up/sso-callback",
      redirectUrlComplete: "/new-user",
    });
  };

  return (
    <div className="lg:min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground">
      <div className="grid lg:grid-cols-2 items-center gap-10 max-w-6xl max-lg:max-w-lg w-full">
        <div>
          <h1 className="lg:text-5xl text-4xl font-bold leading-tight">
            Welcome back to Your Journal
          </h1>
          <p className="text-[15px] mt-6 leading-relaxed">
            Sign in to continue documenting your thoughts, ideas, and
            experiences
          </p>
          <p className="text-[15px] mt-6 lg:mt-12">
            Don’t have an account?
            <a
              href="/sign-up"
              className="ml-1 font-medium text-primary hover:text-primary-hover hover:underline"
            >
              Register here
            </a>
          </p>
        </div>

        <form
          onSubmit={handleEmailSignIn}
          className="max-w-md lg:ml-auto w-full space-y-6"
        >
          <h2 className="text-3xl font-semibold mb-8">Sign in</h2>

          <div>
            <label className="text-sm font-medium mb-2 block">Email</label>
            <input
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background border border-gray-200 w-full text-sm px-4 py-3 rounded-md outline-0 focus:border-primary focus:bg-transparent"
              placeholder="Enter Email"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Password</label>
            <input
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background border border-gray-200 w-full text-sm px-4 py-3 rounded-md outline-0 focus:border-primary focus:bg-transparent"
              placeholder="Enter Password"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-foreground rounded"
              />
              <label htmlFor="remember-me" className="ml-3 block text-sm">
                Remember me
              </label>
            </div>
            <a
              href="#"
              className="text-sm font-medium text-primary hover:text-primary-hover"
            >
              Forgot your password?
            </a>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={!isLoaded}
              className={`w-full py-2.5 px-4 text-[15px] font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none shadow-xl ${
                !isLoaded ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {!isLoaded ? "Loading..." : "Sign In"}
            </button>
          </div>

          <div className="my-6 flex items-center gap-4">
            <hr className="w-full border-gray-300" />
            <p className="text-sm text-foreground text-center">or</p>
            <hr className="w-full border-gray-300" />
          </div>

          <div className="space-x-6 flex justify-center">
            <button
              type="button"
              onClick={() => signInWithOAuth("oauth_google")}
              className="cursor-pointer p-3 rounded-full border border-gray-300 hover:shadow-md transition"
            >
              <FcGoogle size={30} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
