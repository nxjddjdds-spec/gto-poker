import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GTO德州扑克速查表",
  description: "德州扑克 GTO 起手牌范围速查工具",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "GTO速查" },
};

export const viewport: Viewport = {
  themeColor: "#0f1117", width: "device-width", initialScale: 1, maximumScale: 1, userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-[#0f1117] antialiased">{children}</body>
    </html>);
}