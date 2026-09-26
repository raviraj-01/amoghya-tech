import Image from "@/components/media/MediaImage";
import Link from "next/link";
import { ArrowUpRight, Camera, Video, Film, Clapperboard, ScanLine, WandSparkles, Check, Mail } from "lucide-react";
import { CONTACT_EMAIL } from "@/lib/contact-details";
import styles from "@/components/offerings/Offerings.module.css";
import { openGraphForPage } from "@/lib/seo";

export const metadata = {
  title: "Studio & Creative Production",
  description: "Product and corporate photography, brand films, reels, drone content, motion graphics and video editing from Amoghya.",
  alternates: { canonical: "/studio" },
  openGraph: openGraphForPage("/studio", "Studio & Creative Production", "Product and corporate photography, brand films, reels, drone content, motion graphics and video editing from Amoghya."),
};

// Customer Pricing & Offers, section 11. No expired rates or equipment claims.
const formats = [
  { title: "Photography", icon: Camera, description: "Product and corporate photography for your website, catalogue and brand content.", detail: "Product sessions / Corporate sessions" },
  { title: "Films & Promotional Video", icon: Film, description: "Professional videography, promotional videos and brand films shaped around your message.", detail: "Promotional videos: 30-60 seconds / Brand films: 2-4 minutes" },
  { title: "Social Media Reels", icon: Video, description: "Short-form video content for your brand's social channels and campaigns.", detail: "Sets of 10 reels" },
  { title: "Drone Content", icon: ScanLine, description: "Drone photography and videography for an aerial perspective on your location or property.", detail: "Photography / Videography" },
  { title: "Motion & Editing", icon: WandSparkles, description: "Motion graphics and video editing to bring footage, ideas and campaign messages together.", detail: "Motion graphics / Video editing" },
  { title: "Campaign Production", icon: Clapperboard, description: "Creative campaign production bringing photography, video and edited content into one scope.", detail: "Full creative campaign production" },
];

export default function StudioPage() {
  return (
    <PageExperience variant="studio"><div className={styles.page}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>Studio / Creative Content Production</p><h1>Amoghya Studio</h1>
        <p>Photography, film and motion for the places your brand shows up. From the planning call to the final edit.</p>
        <Link className={styles.button} href="/contact?source=studio&interest=Creative%20Content%20Production">Plan a shoot <ArrowUpRight size={18} aria-hidden="true" /></Link>
      </header>
      <section className={styles.section} aria-labelledby="production-heading">
        <div className={styles.sectionHeading}><h2 id="production-heading">Made for your next release.</h2><p>Creative production for restaurants and cafes, fashion and lifestyle, interior design, events and entertainment.</p></div>
        <div className={styles.grid}>{formats.map(({ title, icon: Icon, description, detail }) => (
          <article className={styles.card} key={title}><Icon className={styles.icon} size={24} aria-hidden="true" /><h3>{title}</h3><p>{description}</p><p className={styles.detail}>{detail}</p><Link className={styles.textLink} href={`/contact?source=studio&interest=${encodeURIComponent(title)}`} aria-label={`Discuss ${title.toLowerCase()}`}>Discuss this format <ArrowUpRight size={17} aria-hidden="true" /></Link></article>
        ))}</div>
      </section>
      <section className={styles.section} aria-labelledby="process-heading">
        <div className={styles.sectionHeading}><h2 id="process-heading">From brief to final files.</h2><p>A clear production flow, with the deliverables agreed around your project.</p></div>
        <ol className={styles.steps}>
          {[
            ["Plan", "Start with a pre-shoot planning call to align on the brief."],
            ["Produce", "Capture the agreed content during the on-location shoot."],
            ["Edit", "Bring the assets together with basic editing and colour correction."],
            ["Deliver", "Receive final files in the agreed web and print-ready formats, as applicable."],
          ].map(([title, description], index) => <li key={title}><span className={styles.eyebrow}>0{index + 1}</span><h3>{title}</h3><p>{description}</p></li>)}
        </ol>
      </section>
      <section className={styles.inclusions} aria-labelledby="included-heading">
        <div><p className={styles.eyebrow}>Production scope</p><h2 id="included-heading">The essentials, included.</h2><ul>{["Pre-shoot planning call", "On-location shoot", "Basic colour correction and editing", "Final files for web and print, as applicable"].map(item => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}</ul></div>
        <div><h3>For a broader production</h3><p>Growth and Enterprise scopes add an extra reshoot buffer and additional edited variations.</p><p>Enterprise also includes styling and art direction, with coverage across multiple locations.</p><Link className={styles.textLink} href="/services/creative-content-production">Explore creative services <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
      </section>
      <section className={styles.closing} aria-labelledby="studio-next">
        <Image className={styles.mascot} src="/image/AMO-7.png" alt="AMO, the Amoghya brand character" width={1086} height={1448} sizes="140px" />
        <div><p className={styles.eyebrow}>Start a conversation</p><h2 id="studio-next">What are we creating?</h2><p>Tell us about your subject, location, intended formats and target date.</p><a className={styles.textLink} href={`mailto:${CONTACT_EMAIL}`}><Mail size={17} aria-hidden="true" />{CONTACT_EMAIL}</a></div>
        <Link className={styles.button} href="/contact?source=studio">Discuss production <ArrowUpRight size={18} aria-hidden="true" /></Link>
      </section>
      <ProjectQuestions variant="studio" />
    </div></PageExperience>
  );
}
import { PageExperience } from "@/components/offerings/PageExperience";
import { ProjectQuestions } from "@/components/offerings/ProjectQuestions";
