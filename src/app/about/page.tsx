import Image from "@/components/media/MediaImage";
import Link from "next/link";
import { ArrowUpRight, Layers, Sparkles, ClipboardList, Clock3, MapPin, Mail } from "lucide-react";
import { CONTACT_EMAIL } from "@/lib/contact-details";
import styles from "@/components/offerings/Offerings.module.css";
import about from "./about.module.css";
import { openGraphForPage } from "@/lib/seo";

export const metadata = {
  title: "About Amoghya & AMO",
  description: "Meet Amoghya: a Bengaluru-based team bringing branding, technology, AI, marketing and creative production together.",
  alternates: { canonical: "/about" },
  openGraph: openGraphForPage("/about", "About Amoghya & AMO", "Meet Amoghya: a Bengaluru-based team bringing branding, technology, AI, marketing and creative production together."),
};

// Customer Pricing & Offers, sections 1, 2 and 16. Time-limited offers omitted.
const principles = [
  { icon: Layers, title: "One team, connected services", description: "Branding, technology, AI, marketing and content under one roof, with shared context across the work." },
  { icon: Sparkles, title: "AI with a practical purpose", description: "AI assistants and business automation alongside design and engineering, shaped around everyday business needs." },
  { icon: ClipboardList, title: "A scope you can understand", description: "Starter, Growth and Enterprise packages give you a clear starting point for agreeing the scope and price before you sign." },
  { icon: Clock3, title: "Clear delivery timelines", description: "Service-specific timelines and direct communication so you know what is being delivered and when." },
];

const capabilities = [
  { title: "Shape the brand", description: "Positioning, messaging, visual identity and interface design.", href: "/services/brand-strategy-identity" },
  { title: "Build the platform", description: "Websites, mobile applications and custom business software.", href: "/services/website-development" },
  { title: "Connect the operations", description: "AI solutions, automation and cloud technology services.", href: "/services/business-automation" },
  { title: "Create and reach", description: "Photography, film, motion and digital marketing.", href: "/studio" },
];

export default function AboutPage() {
  return (
    <PageExperience variant="about"><div className={styles.page}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>About / Bengaluru, Karnataka</p>
        <h1>Amoghya Technologies</h1>
        <p>One team for your brand, your technology and what comes next. We bring strategy, design, engineering, AI, marketing and creative production together.</p>
        <Link className={styles.button} href="/contact?source=about">Start a conversation <ArrowUpRight size={18} aria-hidden="true" /></Link>
      </header>

      <section className={styles.section} aria-labelledby="approach-heading">
        <div className={styles.sectionHeading}>
          <h2 id="approach-heading">Less explaining.<br />More shared understanding.</h2>
          <p>A website, a brand identity, a campaign and a business tool should not feel like separate conversations. Amoghya brings these services together so your business context can carry from one part of the project to the next.</p>
        </div>
        <div className={about.principles}>{principles.map(({ icon: Icon, title, description }) => (
          <article className={about.principle} key={title}><Icon size={23} aria-hidden="true" /><div><h3>{title}</h3><p>{description}</p></div></article>
        ))}</div>
      </section>

      <section className={styles.section} aria-labelledby="capabilities-heading">
        <div className={styles.sectionHeading}><h2 id="capabilities-heading">Different disciplines.<br />One business context.</h2><p>Start with the service you need today, or bring several together in a package. Business consulting helps clarify the direction when the brief is still taking shape.</p></div>
        <div className={about.capabilities}>{capabilities.map((item, index) => (
          <Link className={about.capability} href={item.href} key={item.title}><span className={styles.eyebrow}>0{index + 1}</span><div><h3>{item.title}</h3><p>{item.description}</p></div><ArrowUpRight size={20} aria-hidden="true" /></Link>
        ))}</div>
        <Link className={styles.textLink} href="/services/business-consulting">Explore business consulting <ArrowUpRight size={17} aria-hidden="true" /></Link>
      </section>

      <section className={about.amo} aria-labelledby="amo-heading">
        <div className={about.portrait}><Image src="/image/AMO-7.png" alt="AMO, Amoghya's character, with folded arms and bright green star-shaped eyes" width={1086} height={1448} sizes="(max-width: 600px) 200px, 280px" /></div>
        <div><p className={styles.eyebrow}>The face of Amoghya</p><h2 id="amo-heading">Meet AMO.</h2><p>AMO is our brand character and your guide to Amoghya, connecting the different sides of what we do through the website.</p><p>Behind the character is a team working across brand, technology and creative production. The conversation about your project is with us.</p><Link className={styles.textLink} href="/work">Explore our industry solutions <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
      </section>

      <section className={styles.inclusions} aria-labelledby="fit-heading">
        <div><p className={styles.eyebrow}>Room to grow</p><h2 id="fit-heading">The right scope for your stage.</h2><p>From a focused first launch to a more connected business, choose a starting point that fits your needs.</p><Link className={styles.textLink} href="/contact">Discuss your project <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
        <dl className={about.tiers}><div><dt>Starter</dt><dd>Lean scopes for small businesses and early-stage startups.</dd></div><div><dt>Growth</dt><dd>More customization, integrations and brand-specific design.</dd></div><div><dt>Enterprise</dt><dd>Multi-location businesses, complex integrations and higher security needs.</dd></div></dl>
      </section>

      <section className={styles.closing} aria-labelledby="about-contact">
        <div><p className={about.location}><MapPin size={17} aria-hidden="true" /> Bengaluru, Karnataka</p><h2 id="about-contact">Tell us what comes next.</h2><p>Bring your brief, questions or an idea that needs a clearer direction.</p><a className={styles.textLink} href={`mailto:${CONTACT_EMAIL}`}><Mail size={17} aria-hidden="true" />{CONTACT_EMAIL}</a></div>
        <Link className={styles.button} href="/contact?source=about">Discuss your project <ArrowUpRight size={18} aria-hidden="true" /></Link>
      </section>
      <ProjectQuestions variant="about" />
    </div></PageExperience>
  );
}
import { PageExperience } from "@/components/offerings/PageExperience";
import { ProjectQuestions } from "@/components/offerings/ProjectQuestions";
