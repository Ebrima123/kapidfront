import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default function LoginPage() {
  return (
    <main className="grid flex-1 place-items-center bg-sand/60 px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image src="/brand/kapid-logo.png" alt="Kapid" width={827} height={600} priority className="h-28 w-auto" />
          <h1 className="mt-4 font-display text-2xl font-semibold">Kapid Admin</h1>
          <p className="mt-1 text-sm text-muted">Sign in to manage your website and customers.</p>
        </div>
        <div className="card p-6">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
