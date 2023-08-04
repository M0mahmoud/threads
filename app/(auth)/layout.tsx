import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import React, { ReactNode } from "react";
import "../globals.css";
export const metadata = {
  title: "Threads",
  description: "Thread Build With Nextjs version 13 :)",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.className} bg-dark-1`}
          suppressHydrationWarning={true}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
