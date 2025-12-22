"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { OAuthStrategy } from "@clerk/types";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { createNewUser } from "@/server/createNewUser";

export default function SignUpPage() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    try {
      await signUp.create({
        username,
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setIsVerifying(true);
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || "Sign up failed");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId! });
        await createNewUser();
        router.push("/journal");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || "Verification failed");
    }
  };

  // Google OAuth sign-up
  const signUpWithOAuth = (strategy: OAuthStrategy) => {
    if (!isLoaded || !signUp) return;

    signUp.authenticateWithRedirect({
      strategy,
      redirectUrl: "/sign-up/sso-callback",
      redirectUrlComplete: "/",
    });
  };

  return (
    <div className="lg:min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="grid lg:grid-cols-2 items-center gap-10 max-w-6xl max-lg:max-w-lg w-full">
        <div>
          <h1 className="lg:text-5xl text-4xl font-bold text-slate-900 leading-tight">
            Join Us & Get Started
          </h1>
          <p className="text-[15px] mt-6 text-slate-600 leading-relaxed">
            Create your account to start capturing your thoughts, ideas, and
            experiences in your personal journal
          </p>
          <p className="text-[15px] mt-6 lg:mt-12 text-slate-600">
            Already have an account?
            <a
              href="/sign-in"
              className="text-blue-600 font-medium hover:underline ml-1"
            >
              Sign in here
            </a>
          </p>
        </div>

        {!isVerifying ? (
          <form
            onSubmit={handleEmailSignUp}
            className="max-w-md lg:ml-auto w-full space-y-6"
          >
            <h2 className="text-slate-900 text-3xl font-semibold mb-8">
              Sign up
            </h2>

            <div>
              <label className="text-sm text-slate-900 font-medium mb-2 block">
                Username
              </label>
              <input
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-slate-100 w-full text-sm text-slate-900 px-4 py-3 rounded-md border border-gray-200 focus:border-blue-600"
                placeholder="Enter Username"
              />
            </div>

            <div>
              <label className="text-sm text-slate-900 font-medium mb-2 block">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-100 w-full text-sm text-slate-900 px-4 py-3 rounded-md border border-gray-200 focus:border-blue-600"
                placeholder="Enter Email"
              />
            </div>

            <div>
              <label className="text-sm text-slate-900 font-medium mb-2 block">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-100 w-full text-sm text-slate-900 px-4 py-3 rounded-md border border-gray-200 focus:border-blue-600"
                placeholder="Enter Password"
              />
            </div>

            {/* Clerk CAPTCHA placeholder (needed if bot protection is enabled) */}
            <div id="clerk-captcha"></div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={!isLoaded}
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isLoaded ? "Sign Up" : <div className="loader"></div>}
            </button>

            <div className="my-6 flex items-center gap-4">
              <hr className="w-full border-slate-300" />
              <p className="text-sm text-slate-900 text-center">or</p>
              <hr className="w-full border-slate-300" />
            </div>

            <div className="flex justify-center space-x-6">
              <button
                onClick={() => signUpWithOAuth("oauth_google")}
                type="button"
              >
                <FcGoogle size={30} />
              </button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={handleVerify}
            className="max-w-md lg:ml-auto w-full space-y-6"
          >
            <h2 className="text-slate-900 text-3xl font-semibold mb-8">
              Verify your email
            </h2>
            <input
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="bg-slate-100 w-full text-sm text-slate-900 px-4 py-3 rounded-md border border-gray-200 focus:border-blue-600"
              placeholder="Enter verification code"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Verify & Continue
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
