import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import {
  DM_Sans as DMSans,
  JetBrains_Mono as JetBrainsMono,
  Playfair_Display as PlayfairDisplay,
} from "next/font/google";

const playfair = PlayfairDisplay({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-display",
});

const dmSans = DMSans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
});

const jetbrains = JetBrainsMono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Nick Souza — Portfolio",
  description:
    "Portfolio de ilustração e concept art de Nick Souza.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${dmSans.variable} ${jetbrains.variable} min-h-screen bg-[--color-bg] text-[--color-text-primary] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
