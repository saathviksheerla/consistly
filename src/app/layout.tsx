import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { NotificationManager } from "@/components/NotificationManager";
import { AuthProvider } from "@/providers/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { MobileHeader } from "@/components/MobileHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "consistencie",
  description: "Personal Learning Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground flex h-screen overflow-hidden`}>
        <AuthProvider>
          <MobileHeader />
          <Sidebar className="w-64 flex-shrink-0 hidden md:block border-r border-border bg-card z-20" />
          <main className="flex-1 flex flex-col h-full overflow-hidden relative pt-14 md:pt-0 pb-16 md:pb-0">
            <Navbar />
            <NotificationManager />
            <div className="flex-1 overflow-y-auto w-full">
              {children}
            </div>
          </main>
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
