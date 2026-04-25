import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "@/lib/providers";
import { MobileWalletHelper } from "@/components/mobile-wallet-helper";

export const metadata: Metadata = {
  title: "MyWallet Security - Wallet Recovery, Review, and Risk Clarity",
  description: "Review wallet risk, inspect approvals, and move through recovery steps with clear guidance built for self-custody users.",
  keywords: "wallet security, wallet recovery, crypto approvals, self-custody, wallet diagnostics",
  openGraph: {
    title: "MyWallet Security - Wallet Recovery, Review, and Risk Clarity",
    description: "A security-first workspace for wallet recovery, approval reviews, and safer self-custody decisions.",
    url: "https://mywallet.help",
    siteName: "MyWallet Security",
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
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
        <Providers>
          {children}
          <MobileWalletHelper />
        </Providers>
      </body>
    </html>
  );
}
