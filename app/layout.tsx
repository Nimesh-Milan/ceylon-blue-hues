import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ceylon Blue Hues",
  description: "Exquisite gemstones from the heart of Sri Lanka.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
