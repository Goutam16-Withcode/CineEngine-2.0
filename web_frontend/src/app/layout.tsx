import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CineEngine 2.0 — Light Edition • Movie Recommendation Platform",
  description:
    "Next-Gen 4-stage movie recommendation engine powered by vector similarity, Bayesian quality reranking, and multi-seed taste synthesis.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-purple-200 selection:text-purple-900">
        {children}
      </body>
    </html>
  );
}
