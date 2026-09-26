import type { Metadata, Viewport } from "next";
import { ScrollSystem } from "@/components/layout/ScrollSystem";
import { Cinzel, Cormorant } from "next/font/google";
import { ScrollPositionManager } from "@/components/layout/ScrollPositionManager";
import "@/styles/globals.css";
import "lenis/dist/lenis.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { openGraphForPage } from "@/lib/seo";

const siteUrl = new URL("https://amoghya.netlify.app");
const socialImage =
  "https://res.cloudinary.com/dtgvkkgbk/image/upload/c_limit,w_1200,q_auto,f_jpg/v1790323217/ezgif-frame-237_g9we74.png";

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
  metadataBase: siteUrl,
  title: {
    default: "Amoghya Technologies | Brand, Digital & AI Studio",
    template: "%s | Amoghya Technologies",
  },
  description:
    "Amoghya Technologies brings brand strategy, web development, AI automation, digital marketing and creative production together in Bengaluru.",
  authors: [{ name: "Vyara Amogya Technologies" }],
  openGraph: openGraphForPage(
    "/",
    "Amoghya Technologies | Brand, Digital & AI Studio",
    "One Bengaluru team for brand strategy, digital experiences, AI automation, marketing and creative production.",
  ),
  twitter: {
    card: "summary_large_image",
    title: "Amoghya Technologies | Brand, Digital & AI Studio",
    description:
      "One Bengaluru team for brand strategy, digital experiences, AI automation, marketing and creative production.",
    images: [socialImage],
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
