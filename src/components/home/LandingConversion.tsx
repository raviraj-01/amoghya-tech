"use client";
import { SCROLL_SCRUB, SCENE_FRAME_COUNT, scrollDistanceForFrames } from "@/lib/scroll-animation";

import Link from "next/link";
import Image from "@/components/media/MediaImage";
import { ArrowUpRight, Palette, Cpu, Megaphone, PanelsTopLeft, Camera, Compass, Mail, MapPin } from "lucide-react";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { CONTACT_EMAIL } from "@/lib/contact-details";
import styles from "./LandingConversion.module.css";

const outcomeIcons = [Palette, Cpu, Megaphone, PanelsTopLeft, Camera, Compass];
if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);
const outcomes = [
  { title: "Brand + Website Launch", copy: "A consistent identity and a clear digital home.", href: "/services/brand-strategy-identity" },
  { title: "AI + Automation Systems", copy: "Useful assistants and less repetitive work.", href: "/services/artificial-intelligence-solutions" },
  { title: "Content + Campaign Growth", copy: "Creative production connected to your channels.", href: "/services/digital-marketing" },
  { title: "Apps + Portals", copy: "Digital products for customers and internal teams.", href: "/services/mobile-application-development" },
  { title: "Studio Production", copy: "Photography, film and audio with creative direction.", href: "/studio" },
  { title: "Business Consulting", copy: "A clear direction before the next investment.", href: "/services/business-consulting" },
];

function Reveal({ children, className, direction }: { children: React.ReactNode; className?: string; direction?: "left" | "right" | "bottom" }) {
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(direction ? contentRef.current : ref.current, {
        opacity: 0,
        x: direction === "left" ? -72 : direction === "right" ? 72 : 0,
        y: direction === "bottom" ? 88 : direction ? 0 : 18,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: direction ? "top 90%" : "top 95%", end: direction ? "top 50%" : "top 75%", scrub: SCROLL_SCRUB, invalidateOnRefresh: true },
      });
    });
    return () => media.revert();
  }, [direction]);
  return <div ref={ref} className={className}>{direction ? <div ref={contentRef}>{children}</div> : children}</div>;
}

export function PricingPreview() {
  const outcomesRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const root = outcomesRef.current;
    if (!root) return;
    const media = gsap.matchMedia();
    media.add("(min-width: 900px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)", () => {
      const track = root.querySelector<HTMLElement>("[data-outcome-track]")!;
      const cards = Array.from(track.querySelectorAll<HTMLAnchorElement>("a"));
      root.dataset.animated = "true";
      const playhead = { position: 0 };
      const render = () => cards.forEach((card, index) => {
        const distance = index - playhead.position;
        const incoming = Math.max(0, Math.min(1, distance));
        const passed = Math.max(0, Math.min(3, -distance));
        gsap.set(card, {
          xPercent: incoming * 112 - passed * 5,
          y: passed * 12,
          scale: 1 - passed * 0.045,
          rotation: -passed * 3,
          zIndex: index + 1,
          autoAlpha: distance > 1 || distance < -3 ? 0 : 1,
        });
        card.style.pointerEvents = Math.abs(distance) < 0.5 ? "auto" : "none";
      });
      const tween = gsap.to(playhead, {
        position: cards.length - 1, ease: "none", onUpdate: render,
        scrollTrigger: {
          id: "amoghya-outcomes", trigger: root, start: "top top+=88",
          end: () => `+=${scrollDistanceForFrames((cards.length - 1) * SCENE_FRAME_COUNT)}`, pin: true, scrub: SCROLL_SCRUB,
          invalidateOnRefresh: true, refreshPriority: -2, onRefresh: render,
        },
      });
      render();
      const revealFocusedCard = (event: FocusEvent) => {
        const card = event.target as HTMLElement;
        if (!card.matches("a:focus-visible")) return;
        const trigger = tween.scrollTrigger;
        if (!trigger) return;
        const progress = cards.indexOf(card as HTMLAnchorElement) / (cards.length - 1);
        root.querySelector<HTMLElement>("[data-outcome-window]")!.scrollLeft = 0;
        trigger.scroll(trigger.start + progress * (trigger.end - trigger.start));
        tween.progress(progress);
      };
      track.addEventListener("focusin", revealFocusedCard);
      return () => { track.removeEventListener("focusin", revealFocusedCard); cards.forEach(card => { card.style.pointerEvents = ""; }); delete root.dataset.animated; };
    });
    return () => media.revert();
  }, []);
  useLayoutEffect(() => {
    const root = processRef.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-process-card]"));
    const media = gsap.matchMedia();
    media.add("(min-width: 641px) and (prefers-reduced-motion: no-preference)", () => {
      const timeline = gsap.timeline({
        defaults: { ease: "none", duration: 1 },
        scrollTrigger: {
          id: "amoghya-process", trigger: root.querySelector("ol"),
          start: "top 90%", end: "top 20%", scrub: SCROLL_SCRUB,
          invalidateOnRefresh: true, refreshPriority: -3,
        },
      });
      cards.forEach((card, index) => {
        timeline.fromTo(card,
          { xPercent: index === 0 ? -65 : index === 2 ? 65 : 0, y: index === 1 ? 160 : 0, opacity: 0 },
          { xPercent: 0, y: 0, opacity: 1 }, 0);
      });
    });
    media.add("(max-width: 640px) and (prefers-reduced-motion: no-preference)", () => {
      cards.forEach((card, index) => {
        gsap.fromTo(card,
          { xPercent: index === 0 ? -35 : index === 2 ? 35 : 0, y: index === 1 ? 90 : 0, opacity: 0 },
          { xPercent: 0, y: 0, opacity: 1, ease: "none", scrollTrigger: {
            trigger: card.parentElement, start: "top 90%", end: "top 40%",
            scrub: SCROLL_SCRUB, invalidateOnRefresh: true, refreshPriority: -3,
          } });
      });
    });
    // Measure these downstream triggers after the preceding pinned sections.
    const refresh = requestAnimationFrame(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    });
    return () => { cancelAnimationFrame(refresh); media.revert(); };
  }, []);
  return (
    <section id="pricing" className={styles.packages} aria-labelledby="packages-heading">
      <div className={styles.inner}>
        <div ref={outcomesRef} className={styles.outcomes}>
          <div className={`${styles.heading} ${styles.outcomeHeading}`}>
            <p className={styles.outcomeEyebrow}>Your ambition. Our starting point.</p>
            <h2 id="packages-heading"><span className={styles.headingLead}>Start with</span><span className={styles.headingArticle}>the</span><span className={styles.headingOutcome}>outcome<span className={styles.headingPeriod}>.</span></span></h2>
            <div className={styles.headingFinish} aria-hidden="true"><span /><ArrowUpRight size={30} strokeWidth={1.2} /></div>
          </div>
          <div data-outcome-window className={styles.outcomeWindow}>
            <div data-outcome-track className={styles.outcomeGrid}>{outcomes.map((item, i) => { const Icon = outcomeIcons[i]; return <Link key={item.title} href={item.href} className={styles.outcome}><Icon className={styles.outcomeIcon} size={28} aria-hidden="true" /><div><h3>{item.title}</h3><p>{item.copy}</p></div></Link>; })}</div>
          </div>
        </div>
        <section ref={processRef} className={styles.processEditorial} aria-labelledby="process-heading">
          <Reveal className={styles.processHeader}>
            <p className={styles.eyebrow}>One team. Shared context.</p>
            <h3 id="process-heading">From the first conversation<br /><span>to the next chapter.</span></h3>
          </Reveal>
          <ol className={styles.processGallery}>
            {[
              { title: "Understand", copy: "Your goals, audience and existing systems.", image: "AMO-9.png", label: "Listen first" },
              { title: "Define", copy: "A clear scope, priorities and delivery plan.", image: "AMO-7.png", label: "Find the direction" },
              { title: "Build together", copy: "Design, technology and content in one conversation.", image: "AMO-4.png", label: "Make it real" },
            ].map((step) => <li key={step.title}>
              <div data-process-card>
                <div className={styles.processArtwork}>
                  <span className={styles.processLabel}>{step.label}</span>
                  <Image src={`/image/${step.image}`} alt={`AMO accompanies the ${step.title.toLowerCase()} stage`} fill sizes="(max-width: 640px) 90vw, (max-width: 900px) 30vw, 370px" />
                </div>
                <div className={styles.processCaption}><h4>{step.title}</h4><p>{step.copy}</p></div>
              </div>
            </li>)}
          </ol>
        </section>
        <div className={styles.bundles}>
          <Reveal direction="left"><Link href="/work" className={styles.bundleCard}>
            <div className={styles.bundleTop}><Compass size={30} strokeWidth={1.3} aria-hidden="true" /><p className={styles.eyebrow}>For new businesses</p></div>
            <h3>Your first launch</h3><p className={styles.bundleCopy}>Website, logo, brand strategy and performance marketing.</p>
            <span className={styles.bundleFooter}>Make your first impression count <ArrowUpRight size={24} aria-hidden="true" /></span>
          </Link></Reveal>
          <Reveal direction="right"><Link href="/work" className={`${styles.bundleCard} ${styles.bundleHospitality}`}>
            <div className={styles.bundleTop}><Camera size={30} strokeWidth={1.3} aria-hidden="true" /><p className={styles.eyebrow}>For food & hospitality</p></div>
            <h3>Bring your brand to the table</h3><p className={styles.bundleCopy}>Website, product photography, social reels and WhatsApp marketing.</p>
            <span className={styles.bundleFooter}>Give people a reason to choose you <ArrowUpRight size={24} aria-hidden="true" /></span>
          </Link></Reveal>
        </div>
      </div>
    </section>
  );
}

export function ClosingContact() {
  return (
    <section id="landing-contact" className={styles.contact} style={{ backgroundColor: "#000" }} aria-labelledby="landing-contact-heading">
      <div className={styles.inner}>
        <Reveal className={styles.contactGrid}>
          <div><p className={styles.eyebrow}>Let&apos;s make it happen</p><h2 id="landing-contact-heading">What are<br />we building next?</h2><p className={styles.contactCopy}>A new brand. A better website. A smarter way to work. Tell us where you want to go.</p><Link className={`${styles.projectLink} vat-contact-action`} href="/contact?source=closing-start">Start a project <ArrowUpRight size={21} /></Link></div>
          <div className={styles.contactChannels}>
            <p className={styles.eyebrow}>Start a conversation</p>
            <a className={styles.email} href={`mailto:${CONTACT_EMAIL}`}><Mail size={22} aria-hidden="true" /><span>{CONTACT_EMAIL}</span><ArrowUpRight size={22} aria-hidden="true" /></a>
            <div className={styles.location}><MapPin size={18} aria-hidden="true" /><div><strong>Bengaluru, Karnataka</strong><p>Strategy, design and technology. One Amoghya team.</p></div></div>
            <div className={styles.contactRoutes}><Link href="/studio/book">Book the studio <ArrowUpRight size={18} /></Link><Link href="/contact">Discuss your project <ArrowUpRight size={18} /></Link></div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
