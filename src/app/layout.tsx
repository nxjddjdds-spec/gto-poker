import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GTO德州扑克速查表",
  description: "德州扑克 GTO 起手牌范围速查工具",
  manifest: "/gto-poker/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "GTO速查" },
};

export const viewport: Viewport = {
  themeColor: "#0f1117", width: "device-width", initialScale: 1, maximumScale: 1, userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          if (typeof window !== "undefined" && "serviceWorker" in navigator) {
            window.addEventListener("load", function() {
              navigator.serviceWorker.register("/gto-poker/sw.js").catch(function(){});
            });
          }
        `}} />
      </head>
      <body className="min-h-screen bg-[#0f1117] antialiased">{children}</body>
    </html>
  );
}
