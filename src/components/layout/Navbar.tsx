"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Menu,
  X,
  ArrowUpRight,
  ChevronDown,
  Palette,
  PanelsTopLeft,
  Smartphone,
  Database,
  BrainCircuit,
  Megaphone,
  Camera,
  PenTool,
  Cloud,
  Workflow,
  Compass,
} from "lucide-react";
import { serviceRailData } from "@/components/services/service-rail-data";
import styles from "./Navbar.module.css";

const pages = [
  { label: "Home", href: "/" },
  { label: "What We Do", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Studio", href: "/studio" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
const groups = [
  { title: "Brand & Design", indices: [0, 7] },
  { title: "Web & Products", indices: [1, 2, 3] },
  { title: "AI & Operations", indices: [4, 8, 9] },
  { title: "Content & Growth", indices: [5, 6, 10] },
];
const icons = [
  Palette,
  PanelsTopLeft,
  Smartphone,
  Database,
  BrainCircuit,
  Megaphone,
  Camera,
  PenTool,
  Cloud,
  Workflow,
  Compass,
];

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const reduced = useReducedMotion();
  const header = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const mobileTrigger = useRef<HTMLButtonElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [homeNavVisible, setHomeNavVisible] = useState(false);
  const close = () => {
    setMobileOpen(false);
    setServicesOpen(false);
  };

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!isHome) {
      setHomeNavVisible(true);
      return;
    }

    const updateVisibility = () => setHomeNavVisible(window.scrollY > 12);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, [isHome]);
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) {
        setMobileOpen(false);
        setServicesOpen(false);
      }
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (mobileOpen) mobileTrigger.current?.focus();
      else if (servicesOpen) trigger.current?.focus();
      setServicesOpen(false);
      setMobileOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [servicesOpen, mobileOpen]);

  if (pathname.startsWith("/admin")) return null;
  const active = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const menuContent = (
    <>
      <div className={styles.groups}>
        {groups.map((group) => (
          <div className={styles.group} key={group.title}>
            <h2>{group.title}</h2>
            {group.indices.map((index) => {
              const service = serviceRailData[index];
              const Icon = icons[index];
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  onClick={close}
                  className={styles.serviceLink}
                >
                  <span className={styles.serviceIcon}>
                    <Icon size={19} strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span>{service.title}</span>
                  <ArrowUpRight
                    className={styles.serviceArrow}
                    size={14}
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </div>
        ))}
      </div>
      <div className={styles.menuFooter}>
        <span>One team. Every part of your next chapter.</span>
        <Link href="/services" onClick={close}>
          Explore all services <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </>
  );

  return (
    <header
      ref={header}
      className={`${styles.header} ${isHome ? styles.homeHeader : ""} ${isHome && homeNavVisible ? styles.homeNavVisible : ""}`}
      onMouseLeave={() => {
        if (!header.current?.contains(document.activeElement))
          setServicesOpen(false);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) close();
      }}
    >
      <div className={styles.shell}>
        <Link href="/" className={styles.brand} onClick={close}>
          <span className={styles.mark}>VAT</span>
          <span className={styles.brandCopy}>
            <span>{isHome ? "Amoghya" : "Vyara Amogya"}</span>
            <small>Beyond Your Expectations</small>
          </span>
        </Link>
        <nav className={styles.desktopNav} aria-label="Main navigation">
          {pages.map((item) =>
            item.href === "/services" ? (
              <div
                className={styles.serviceNav}
                key={item.href}
                onMouseEnter={() => setServicesOpen(true)}
              >
                <Link
                  href={item.href}
                  className={styles.navLink}
                  aria-current={active(item.href) ? "page" : undefined}
                  onClick={close}
                >
                  {item.label}
                </Link>
                <button
                  ref={trigger}
                  className={styles.disclosure}
                  type="button"
                  aria-label="Browse services"
                  aria-expanded={servicesOpen}
                  aria-controls="desktop-services-menu"
                  onClick={() => setServicesOpen((value) => !value)}
                >
                  <ChevronDown size={15} aria-hidden="true" />
                </button>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                onMouseEnter={() => setServicesOpen(false)}
                className={styles.navLink}
                aria-current={active(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <Link
          href="/contact?source=global-nav"
          onClick={close}
          className={`${styles.projectLink} vat-contact-action`}
        >
          <span>Start a Project</span>
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
        <button
          ref={mobileTrigger}
          type="button"
          className={styles.menuButton}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          onClick={() => {
            setMobileOpen((value) => !value);
            setServicesOpen(false);
          }}
        >
          {mobileOpen ? <X size={23} /> : <Menu size={23} />}
          {isHome && <span>{mobileOpen ? "Close" : "Menu"}</span>}
        </button>
      </div>
      <AnimatePresence>
        {servicesOpen && !mobileOpen && (
          <motion.div
            id="desktop-services-menu"
            className={styles.megaMenu}
            initial={{ opacity: 0, y: reduced ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -6 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
          >
            {menuContent}
          </motion.div>
        )}
        {mobileOpen && (
          <motion.nav
            aria-label={isHome ? "Main navigation" : "Mobile navigation"}
            id="mobile-navigation"
            className={styles.mobileMenu}
            initial={{ opacity: 0, y: reduced ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onMouseLeave={() => setServicesOpen(false)}
          >
            {pages.map((item) => (
              <div
                key={item.href}
                className={styles.mobileRow}
                onMouseEnter={() => setServicesOpen(item.href === "/services")}
              >
                <Link
                  href={item.href}
                  onClick={close}
                  aria-current={active(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
                {item.href === "/services" && (
                  <button
                    type="button"
                    aria-label="Browse services"
                    aria-expanded={servicesOpen}
                    aria-controls="mobile-services-menu"
                    onClick={() => setServicesOpen((value) => !value)}
                  >
                    <ChevronDown size={18} />
                  </button>
                )}
              </div>
            ))}
            <AnimatePresence initial={false}>
              {servicesOpen && (
                <motion.div
                  id="mobile-services-menu"
                  initial={{ opacity: 0, height: 0, y: -8 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -8 }}
                  transition={{ duration: reduced ? 0 : 0.22, ease: "easeOut" }}
                  style={{ overflow: "hidden" }}
                >
                  {menuContent}
                </motion.div>
              )}
            </AnimatePresence>
            <Link
              className={`${styles.mobileProject} vat-contact-action`}
              href="/contact?source=mobile-nav"
              onClick={close}
            >
              <span>Let&apos;s talk</span>
              <ArrowUpRight size={18} />
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
