import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServicesSection } from "@/components/services/ServicesSection";
import { ServiceExplorer } from "@/components/services/ServiceExplorer";

export const metadata = {
  title: "Services | Vyara Amogya Technologies",
  description: "Explore eleven connected services across brand, websites, apps, software, AI, marketing, content, design, cloud, automation and consulting.",
};

export default function ServicesPage() {
  return (
    <>
      <h1 className="sr-only">Amoghya Technologies Services</h1>
      <ServiceExplorer />
      <ServicesSection />
      <section className="mx-auto my-16 grid max-w-container gap-10 bg-[#171a17] px-8 py-14 text-white sm:px-12 lg:grid-cols-[1fr_auto] lg:items-end">
        <div><p className="mb-5 text-xs uppercase text-[#c8ff3d]">One connected scope</p><h2 className="max-w-2xl text-3xl font-semibold sm:text-4xl">Bring the right services together.</h2><p className="mt-5 max-w-xl text-lg leading-8 text-white/65">Tell us your priorities. We will help you shape a connected scope around your business.</p></div>
        <Link href="/contact?source=services" className="inline-flex w-fit items-center gap-8 bg-[#c8ff3d] px-6 py-4 text-sm font-semibold text-black transition-transform hover:-translate-y-1">Discuss your project <ArrowRight size={18} /></Link>
      </section>
    </>
  );
}
