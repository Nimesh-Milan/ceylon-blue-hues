import type { Metadata } from "next";
import { Lato, Playfair_Display } from "next/font/google";
import "./globals.css";

const lato = Lato({ subsets: ["latin"], weight: ["300", "400", "700"], style: ["normal", "italic"], variable: "--font-sans", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });

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
    <html lang="en" className={`h-full antialiased ${lato.variable} ${playfair.variable}`}>
      
      <body className="min-h-full flex flex-col font-sans bg-cream text-navy">
        {children}
      </body>
    </html>
  );
}