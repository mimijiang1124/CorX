import Web3Provider from "@/providers/Web3Provider";
import "./globals.css";
import React from "react";

export const metadata = {
  title: "DirectAid Protocol",
  description: "Transparent, Direct, and Earmarked Crypto Philanthropy",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}