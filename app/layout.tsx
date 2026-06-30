import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "IdeaWatts — spark, share & vote on ideas",
  description:
    "Open a thread, drop your ideas, upvote the best ones, and watch the leaderboard light up.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-6 sm:pt-10">
          {children}
        </main>
      </body>
    </html>
  );
}
