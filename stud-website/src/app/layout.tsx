import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stud",
  description: "AI coding assistant with deep Roblox Studio integration.",
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
