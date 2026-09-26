import type { Metadata } from "next";
import { HomeExperience } from "@/components/home/HomeExperience";

export const metadata: Metadata = {
  title: "Amoghya Technologies | Brand, Digital & AI Studio",
  description:
    "Amoghya Technologies brings brand strategy, web development, AI automation, digital marketing and creative production together in Bengaluru.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <HomeExperience />;
}
