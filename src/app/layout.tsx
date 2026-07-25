import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const SITE = "https://ba-klimakommunikation-viz.vercel.app";
const TITLE = "Getrennt wird im Wie — Klimakommunikation RWE · VW · BASF (2010–2024)";
const DESC =
  "Interaktive Visualisierung der empirischen Befunde einer Bachelorarbeit zu Short-Termism und Klimakommunikation (RWE, Volkswagen, BASF, 2010–2024, 1.509 Kodierungen).";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESC,
  applicationName: "Getrennt wird im Wie",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: SITE,
    siteName: "Getrennt wird im Wie",
    title: TITLE,
    description: DESC,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="grain" aria-hidden />
        <Nav />
        {children}
      </body>
    </html>
  );
}
