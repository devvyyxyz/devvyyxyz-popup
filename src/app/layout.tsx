import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Devvyy Badge Editor",
  description: "Customize and install the Made by Devvyy.xyz badge widget for your website.",
  icons: {
    icon: "/FavIcon.png",
  },
  openGraph: {
    title: "Devvyy Badge Editor",
    description: "Customize and install the Made by Devvyy.xyz badge widget.",
    type: "website",
  },
};

// Read basePath at build time so the client-side badge loader can resolve
// the local devvyy-badge.js correctly on GitHub Pages subdirectory deploys.
const basePath = process.env.NEXT_BASE_PATH || "";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta name="base-path" content={basePath} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}