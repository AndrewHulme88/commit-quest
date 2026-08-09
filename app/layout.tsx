import { Providers } from "./providers";
import "./globals.css";
import { Toaster } from "sonner";
import { DM_Mono, Instrument_Sans } from "next/font/google";
import type { Metadata } from "next";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Commit Quest | Make your coding habit visible",
  description: "Track GitHub progress, build coding streaks, and share milestones with other developers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${instrumentSans.variable} ${dmMono.variable}`}>
        <Providers>{children}</Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
