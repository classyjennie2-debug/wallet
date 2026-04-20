import type { Metadata } from "next";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
