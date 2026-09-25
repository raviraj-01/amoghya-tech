import type { Metadata, Viewport } from "next";
import { ScrollSystem } from "@/components/layout/ScrollSystem";
import { Cinzel, Cormorant } from "next/font/google";
import { ScrollPositionManager } from "@/components/layout/ScrollPositionManager";
import "@/styles/globals.css";
import "lenis/dist/lenis.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const cormorant = Cormorant({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0F172A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "Vyara Amogya Technologies | Led by AMO",
    template: "%s | Vyara Amogya Technologies",
  },
  description:
    "A premier marketing and commercial-operations platform led by AMO. Strategy, Branding, Digital Experiences, Engineering, AI & Automation, and Studio Services.",
  keywords: [
    "AMO",
    "Digital Experience",
    "Creative Studio",
    "AI Automation",
    "Full-Stack Engineering",
    "Brand Strategy",
    "Commercial Operations",
  ],
  authors: [{ name: "Vyara Amogya Technologies" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://amoghya.tech",
    siteName: "Vyara Amogya Technologies",
    title: "Vyara Amogya Technologies | Interactive 3D & Digital Operations",
    description:
      "A premium marketing and commercial-operations platform led by AMO. Strategy, Branding, Digital Experiences, Engineering, Automation, and Studio Services.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vyara Amogya Technologies | Led by AMO",
    description:
      "A premier marketing and commercial-operations platform led by AMO.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${cinzel.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-surface-base text-content-primary antialiased font-sans">
        <ScrollSystem />
        <ScrollPositionManager />
        <Navbar />
        <main className="flex-grow pt-[4.5rem]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
