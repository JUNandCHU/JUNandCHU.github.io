import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Field Notes",
  description: "연구와 소설, 그리고 그 사이의 메모들.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
