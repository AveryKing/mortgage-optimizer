"use client";
import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Sign in</h1>
      <button
        onClick={() => signIn("azure-ad")}
        className="px-6 py-2 bg-blue-600 text-white rounded"
      >
        Sign in with Microsoft
      </button>
    </div>
  );
}
