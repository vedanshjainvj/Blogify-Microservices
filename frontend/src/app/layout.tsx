import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import { AppProvider } from "@/context/AppContext";                                                                                                                                                                                   

export const metadata: Metadata = {
  title: "Blogify",
  description: "AI Powered Blogging Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <Navbar />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}