import type { Metadata } from "next";
import "./globals.css";
import "./map-demo.css";
import { GlobalBgmPlayer } from "@/components/global-bgm-player";

export const metadata: Metadata = {
  title: "Tianjiao Hao — Global Marketing · Brand · GTM",
  description: "Tianjiao Hao 的个人作品集。关于我、实习经历、我的作品、兴趣爱好与联系方式。",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="stylesheet" href="/fonts/xiaohe.css" />
        <link rel="stylesheet" href="/fonts/cormorant.css" />
      </head>
      <body>{children}<GlobalBgmPlayer /></body>
    </html>
  );
}
