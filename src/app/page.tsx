import type { Metadata } from "next";
import { HomeExperience } from "@/components/home/HomeExperience";

export const metadata: Metadata = {
  title: "Vyara Amogya Technologies | Led by AMO",
  description:
    "Interactive 3D narrative led by AMO. Strategy, Branding, Web Experiences, Engineering, AI & Automation, Content, and Studio Services.",
};

export default function HomePage() {
  return <HomeExperience />;
}

