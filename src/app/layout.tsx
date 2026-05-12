import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PHOTO_OS PRO — Masterclass A6000 & S24 Ultra",
  description:
    "App de aprendizaje de fotografía para Sony a6000 y Samsung S24 Ultra en Guadalajara. Lecciones, desafíos, análisis EXIF y crítica AI.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PHOTO_OS",
  },
  openGraph: {
    title: "PHOTO_OS PRO",
    description: "Tu academia de fotografía de bolsillo para GDL",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
