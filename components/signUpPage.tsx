"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { OAuthStrategy } from "@clerk/types";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

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
        router.push("/new-user");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || "Verification failed");
    }
  };

  const signUpWithOAuth = async (strategy: OAuthStrategy) => {
    if (!isLoaded || !signUp) return;

    signUp.authenticateWithRedirect({
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
            Join Us & Get Started
          </h1>
          <p className="text-[15px] mt-6 leading-relaxed">
            Create your account to start capturing your thoughts, ideas, and
            experiences in your personal journal
          </p>
          <p className="text-[15px] mt-6 lg:mt-12">
            Already have an account?
            <a
              href="/sign-in"
              className="ml-1 font-medium text-primary hover:text-primary-hover hover:underline"
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
            <h2 className="text-3xl font-semibold mb-8">Sign up</h2>

            <div>
              <label className="text-sm font-medium mb-2 block">Username</label>
              <input
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-background border border-foreground w-full text-sm px-4 py-3 rounded-md outline-0 focus:border-primary focus:bg-transparent"
                placeholder="Enter Username"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background border border-foreground w-full text-sm px-4 py-3 rounded-md outline-0 focus:border-primary focus:bg-transparent"
                placeholder="Enter Email"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background border border-foreground w-full text-sm px-4 py-3 rounded-md outline-0 focus:border-primary focus:bg-transparent"
                placeholder="Enter Password"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={!isLoaded}
              className={`w-full py-3 text-white rounded-md bg-primary hover:bg-primary-hover ${
                !isLoaded ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoaded ? "Sign Up" : "Loading..."}
            </button>

            <div className="my-6 flex items-center gap-4">
              <hr className="w-full border-foreground" />
              <p className="text-sm text-foreground text-center">or</p>
              <hr className="w-full border-foreground" />
            </div>

            <div className="flex justify-center space-x-6">
              <button
                onClick={() => signUpWithOAuth("oauth_google")}
                type="button"
                className="cursor-pointer p-3 rounded-full border border-foreground hover:shadow-md transition"
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
            <h2 className="text-3xl font-semibold mb-8">Verify your email</h2>
            <input
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="bg-background border border-foreground w-full text-sm px-4 py-3 rounded-md outline-0 focus:border-primary focus:bg-transparent"
              placeholder="Enter verification code"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button className="w-full py-3 text-white rounded-md bg-primary hover:bg-primary-hover">
              Verify & Continue
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
