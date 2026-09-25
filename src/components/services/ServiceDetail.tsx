"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { SCROLL_SCRUB } from "@/lib/scroll-animation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { getSubServices, serviceRailData } from "./service-rail-data";
import styles from "./ServiceDetail.module.css";

export function ServiceDetail({ service }: { service: typeof serviceRailData[number] }) {
  const subServices = getSubServices(service);
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(subServices[0]?.id);
  const nextService = serviceRailData[(serviceRailData.findIndex(item => item.slug === service.slug) + 1) % serviceRailData.length];
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>("[data-sub-service]", rootRef.current!);
      sections.forEach(section => ScrollTrigger.create({
        trigger: section, start: "top 45%", end: "bottom 45%",
        onEnter: () => setActive(section.id), onEnterBack: () => setActive(section.id),
      }));
    }, rootRef);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      rootRef.current?.querySelectorAll<HTMLElement>("[data-sub-copy]").forEach(copy => {
        gsap.fromTo(copy, { x: 36, opacity: .3 }, { x: 0, opacity: 1, ease: "none",
          scrollTrigger: { trigger: copy.parentElement, start: "top 90%", end: "top 55%", scrub: SCROLL_SCRUB } });
      });
    });
    return () => { media.revert(); context.revert(); };
  }, [service.slug]);
  return (
    <div ref={rootRef} className={styles.page} data-service-detail>
      <Link href="/services" className={styles.back}><ArrowLeft size={16} /> All services</Link>
      <header className={styles.header}>
        <p className={styles.eyebrow}>What we do / Amoghya</p>
        <h1>{service.title}</h1>
        <p>{service.description}</p>
      </header>
      <div className={styles.content}>
        <nav aria-label={`${service.title} sub-services`} className={styles.nav}>
          <p className={styles.eyebrow}>In this service</p>
          {subServices.map(item => <Link key={item.id} href={`#${item.id}`} aria-current={active === item.id ? "location" : undefined}>{item.title}<ArrowUpRight size={14} /></Link>)}
        </nav>
        <div>
          {subServices.map((item) => (
            <section data-sub-service key={item.id} id={item.id} className={styles.subService}>
              <div data-sub-copy>
              <span className={styles.eyebrow}>Your scope / {service.title}</span>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <Link className={styles.scopeLink} href={`/contact?service=${encodeURIComponent(service.title)}&interest=${encodeURIComponent(item.title)}`}>Discuss {item.title.toLowerCase()} <ArrowUpRight size={18} aria-hidden="true" /></Link>
              </div>
            </section>
          ))}
          <section className={styles.contact}>
            <p className={styles.eyebrow}>Your next step</p>
            <h2>Let&apos;s shape the right scope.</h2>
            <p>Tell us what you need, where you are today and what you want to achieve. We&apos;ll help you define the next step.</p>
            <Link className="vat-contact-action" href={`/contact?service=${encodeURIComponent(service.title)}`}>Discuss your project <ArrowRight size={18} /></Link>
          </section>
          <Link className={styles.nextService} href={`/services/${nextService.slug}`}><span>Explore another discipline<strong>{nextService.title}</strong></span><ArrowUpRight size={28} aria-hidden="true" /></Link>
        </div>
      </div>
    </div>
  );
}
