"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SignUpCallback() {
  return <AuthenticateWithRedirectCallback />;
}
