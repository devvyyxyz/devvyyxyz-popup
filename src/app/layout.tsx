import type { Metadata } from "next";
import "./globals.css";

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                --font-mono: "JetBrains Mono", "Fira Code", ui-monospace, monospace;
              }
            `,
          }}
        />
      </head>
      <body className="antialiased bg-background text-foreground" style={{ fontFamily: 'var(--font-sans)' }}>
        {children}
      </body>
    </html>
  );
}