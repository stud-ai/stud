import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PlayerZero",
  description: "AI Support and QA agents that triage and test every ticket.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
