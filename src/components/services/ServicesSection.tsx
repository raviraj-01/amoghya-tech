"use client";
import {
  SCROLL_SCRUB,
  SCENE_FRAME_COUNT,
  scrollDistanceForFrames,
} from "@/lib/scroll-animation";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import Image from "@/components/media/MediaImage";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { serviceRailData, serviceSlug } from "./service-rail-data";
import styles from "./ServicesSection.module.css";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const services = serviceRailData.filter((service) =>
  ["01", "02", "03", "05", "06", "07"].includes(service.number),
);

export function ServicesSection() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;
    const rows = Array.from(
      root.querySelectorAll<HTMLElement>("[data-service-row]"),
    );
    const media = gsap.matchMedia();

    media.add(
      "(min-width: 768px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)",
      () => {
        root.dataset.rail = "true";
        const parts = rows.map((row) => ({
          row,
          title: row.querySelector<HTMLElement>("h3")!,
          underline: row.querySelector<HTMLElement>("[data-title-line]")!,
          details: row.querySelector<HTMLElement>("[data-details]")!,
          list: row.querySelector<HTMLElement>("ul")!,
          line: row.querySelector<HTMLElement>("[data-line]")!,
          artwork: row.querySelector<HTMLElement>("[data-artwork]")!,
          links: Array.from(row.querySelectorAll<HTMLAnchorElement>("a")),
        }));
        let currentIndex = -1;
        const clamp = gsap.utils.clamp(0, 1);
        const revealEase = gsap.parseEase("power2.out");
        const transition = (position: number) => {
          const index = Math.min(services.length - 1, Math.floor(position));
          const height = stage.clientHeight;
          parts.forEach(
            (
              { row, title, underline, details, list, line, artwork, links },
              i,
            ) => {
              const local = position - i;
              const incoming = i === 0 ? 0 : 1 - clamp(local / 0.18);
              const outgoing = clamp((local - 1) / 0.18);
              const focus = 1 - outgoing;
              row.style.visibility =
                local >= 0 && local < 1.2 ? "visible" : "hidden";
              row.style.zIndex = String(i + 1);
              row.style.transform = `translate3d(0,${incoming * height - outgoing * height * 0.12}px,0) scale(${1 - outgoing * 0.07})`;
              row.style.opacity = String(1 - outgoing * 0.6);
              // Reveal only after the panel arrives; every card gets the same reading hold.
              const imageReveal = revealEase(clamp((local - 0.2) / 0.25));
              const headingReveal = revealEase(clamp((local - 0.5) / 0.24));
              title.style.opacity = String(headingReveal);
              title.style.transform = `translateY(${(1 - headingReveal) * 110}%)`;
              underline.style.transform = `scaleX(${clamp((local - 0.43) / 0.18)})`;
              details.style.transform = `translateY(${incoming * 55}px)`;
              list.style.transform = `translateY(${incoming * 18}px)`;
              artwork.style.opacity = String(imageReveal);
              artwork.style.transform = `translateY(${(1 - imageReveal) * 45}px) scale(${0.9 + imageReveal * 0.1})`;
              line.style.transform = `scaleX(${0.3 + focus * 0.7})`;
              row.setAttribute("aria-hidden", String(i !== index));
              links.forEach((link) => (link.tabIndex = i === index ? 0 : -1));
              row.style.pointerEvents = i === index ? "auto" : "none";
            },
          );
          if (index !== currentIndex) {
            currentIndex = index;
            root.dataset.activeService = String(index + 1);
          }
        };
        const playhead = { position: 0 };
        gsap.to(playhead, {
          position: services.length,
          ease: "none",
          onUpdate: () =>
            transition(Math.min(services.length - 0.001, playhead.position)),
          scrollTrigger: {
            id: "amoghya-service-rail",
            // The upstream hero installs its pin after intro initialization.
            refreshPriority: -1,
            trigger: stage,
            pin: stage,
            start: "top top+=72",
            end: () =>
              `+=${scrollDistanceForFrames(services.length * SCENE_FRAME_COUNT)}`,
            scrub: SCROLL_SCRUB,
            invalidateOnRefresh: true,
            onRefresh: () =>
              transition(Math.min(services.length - 0.001, playhead.position)),
          },
        });
        transition(0);
        return () => {
          delete root.dataset.rail;
          delete root.dataset.activeService;
          parts.forEach(
            ({
              row,
              title,
              underline,
              details,
              list,
              line,
              artwork,
              links,
            }) => {
              [row, title, underline, details, list, line, artwork].forEach(
                (element) => element.removeAttribute("style"),
              );
              row.removeAttribute("aria-hidden");
              links.forEach((link) => link.removeAttribute("tabindex"));
            },
          );
        };
      },
    );

    media.add(
      "((max-width: 767px) or (max-height: 599px)) and (prefers-reduced-motion: no-preference)",
      () => {
        rows.forEach((row) => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: row,
                start: "top 85%",
                end: "top 35%",
                scrub: SCROLL_SCRUB,
              },
            })
            .from(row.querySelector("[data-artwork]"), {
              opacity: 0,
              y: 35,
              scale: 0.9,
              duration: 0.85,
            })
            .from(row.querySelector("[data-title-line]"), {
              scaleX: 0,
              duration: 0.45,
            })
            .from(
              row.querySelector("h3"),
              { yPercent: 110, opacity: 0, duration: 0.75, ease: "power3.out" },
              "-=0.1",
            );
        });
      },
    );
    return () => {
      media.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="service-rail"
      className={styles.section}
      aria-labelledby="service-rail-heading"
    >
      <header className={styles.intro}>
        <p className={styles.eyebrow}>Services</p>
        <div className={styles.introCopy}>
          <h2 id="service-rail-heading">
            Everything your business needs to build, launch and grow.
          </h2>
          <p>
            Technology, design, AI, marketing and business services. One Amoghya
            team, from the first idea to what comes next.
          </p>
        </div>
      </header>
      <div ref={stageRef} className={styles.stage}>
        <div className={styles.viewport}>
          {services.map((service, index) => (
            <article
              key={service.number}
              data-service-row
              className={styles.row}
              data-tone={["ink", "ice", "rose", "lime"][index % 4]}
            >
              <div className={styles.titleGroup}>
                <p className={styles.kicker}>
                  Amoghya /{" "}
                  {["Create", "Connect", "Build", "Evolve"][index % 4]}
                </p>
                <div data-artwork className={styles.artwork} aria-hidden="true">
                  <Image
                    src="/image/AMO-7.png"
                    alt=""
                    width={1086}
                    height={1448}
                    sizes="180px"
                  />
                  <span>
                    Ideas.
                    <br />
                    Made real.
                  </span>
                </div>
                <div className={styles.headingReveal}>
                  <div className={styles.headingMask}>
                    <h3>{service.title}</h3>
                  </div>
                  <span
                    data-title-line
                    className={styles.titleLine}
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div data-details className={styles.details}>
                <p>{service.description}</p>
                <ul>
                  {service.subServices.map((item) => (
                    <li key={item}>
                      <Link
                        href={`/services/${service.slug}#${serviceSlug(item)}`}
                      >
                        {item}
                        <ArrowUpRight size={14} aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  className={`${styles.explore} vat-animated-button`}
                  href={`/services/${service.slug}`}
                >
                  Explore service <ArrowUpRight size={18} aria-hidden="true" />
                </Link>
              </div>
              <span data-line className={styles.line} aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
