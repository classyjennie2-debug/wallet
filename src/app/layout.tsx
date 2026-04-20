import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "@/lib/providers";

export const metadata: Metadata = {
  title: "MyWallet.Help - Fix Your Wallet Issues",
  description: "Professional wallet recovery and issue resolution platform. Detect dead coins, fix transaction errors, and manage your crypto safely.",
  keywords: "wallet help, crypto recovery, dead coin detector, blockchain support",
  openGraph: {
    title: "MyWallet.Help - Crypto Wallet Issues Fixed",
    description: "Fix wallet issues, recover funds, and manage your cryptocurrency portfolio safely",
    url: "https://mywallet.help",
    siteName: "MyWallet.Help",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#0f172a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MyWallet.Help" />
      </head>
      <body className="bg-slate-950 text-white">
        <Providers>{children}</Providers>
        
        {/* Suppress non-critical third-party errors in console */}
        <Script 
          id="suppress-analytics-errors"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const origError = console.error;
                console.error = function(...args) {
                  const message = args[0]?.toString?.() || '';
                  // Suppress Analytics SDK and other non-critical errors
                  if (message.includes('Analytics SDK') || message.includes('Failed to fetch')) {
                    return;
                  }
                  origError.apply(console, args);
                };
                
                // Suppress unhandled promise rejections from Analytics SDK
                window.addEventListener('unhandledrejection', (event) => {
                  if (event.reason?.message?.includes('Failed to fetch')) {
                    event.preventDefault();
                  }
                });
              })();
            `
          }}
        />
      </body>
    </html>
  );
}
