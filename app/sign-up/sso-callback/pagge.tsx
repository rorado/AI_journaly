"use client";

import { createNewUser } from "@/server/createNewUser";
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default async function SignUpCallback() {
  return <AuthenticateWithRedirectCallback />;
}
