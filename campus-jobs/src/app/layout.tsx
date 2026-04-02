import type { Metadata } from "next";
import { Inter, Merriweather, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = Merriweather({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "700", "900"],
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Кампус Карьера",
  description: "Платформа для поиска подработки и стажировок в кампусе",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full dark">
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} min-h-dvh bg-background text-foreground antialiased`}
        style={{
          letterSpacing: 'var(--tracking-normal)'
        }}
      >
        {children}
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}
