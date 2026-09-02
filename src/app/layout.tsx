import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AllCollegeEvent — AI Event Intelligence Platform",
  description:
    "AI-powered discovery that connects your skills, interests, career goals and location with the right student opportunities. Find hackathons, internships, workshops, and more.",
  keywords: [
    "student opportunities",
    "hackathons",
    "internships",
    "workshops",
    "AI recommendations",
    "college events",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
