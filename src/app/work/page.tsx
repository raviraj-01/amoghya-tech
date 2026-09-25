import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import styles from "@/components/offerings/Offerings.module.css";

export const metadata = {
  title: "Work & Industry Solutions",
  description: "Explore Amoghya's industry packages for startups, restaurants, e-commerce, real estate, hospitality and interior design.",
};

// Customer Pricing & Offers, section 4: offered scopes, not case studies.
const solutions = [
  { industry: "Startups", title: "Startup Launch", description: "Bring your identity, website and launch marketing together.", scope: ["Business Website", "Logo Design", "Brand Strategy", "Performance Marketing"] },
  { industry: "Restaurants & Cafes", title: "Restaurant Launch", description: "Connect your menu and brand with the content that brings them to life.", scope: ["Business Website", "Product Photography", "Social Media Reels", "WhatsApp Marketing"] },
  { industry: "Retail & E-commerce", title: "E-commerce Launch", description: "Connect your storefront, checkout and stock with performance marketing.", scope: ["E-commerce Platform", "Payment Gateway Integration", "Inventory Management", "Performance Marketing"] },
  { industry: "Real Estate", title: "Real Estate Growth", description: "Pair property content with a website and tools to manage enquiries.", scope: ["Corporate Website", "Drone Photography & Videography", "CRM Development", "Lead Generation Campaigns"] },
  { industry: "Interior Design", title: "Interior Design Portfolio", description: "Give your spaces a considered home through design, video and storytelling.", scope: ["Portfolio Website", "Professional Videography", "Website UI Design", "Brand Film"] },
  { industry: "Hospitality", title: "Hospitality Booking", description: "Bring reservations and guest-facing content into one connected scope.", scope: ["Booking & Reservation System", "Professional Videography", "Social Media Marketing", "WhatsApp Marketing"] },
];

export default function WorkPage() {
  return (
    <PageExperience variant="work"><div className={styles.page}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>Work / Industry Solutions</p>
        <h1>What we build.</h1>
        <p>Brand, technology and creative production, brought together around your business.</p>
        <Link className={styles.button} href="/contact?source=work">Discuss your project <ArrowUpRight size={18} aria-hidden="true" /></Link>
      </header>
      <section className={styles.section} aria-labelledby="solutions-heading">
        <div className={styles.sectionHeading}>
          <h2 id="solutions-heading">Solutions by industry</h2>
          <p>Available service packages, not completed client case studies. Choose a starting point and we will help define the scope.</p>
        </div>
        <nav aria-label="Choose an industry" data-industry-nav>
          {solutions.map((item, index) => <a href={`#industry-${index + 1}`} key={item.title}>{item.industry}<ArrowUpRight size={15} aria-hidden="true" /></a>)}
        </nav>
        <div className={styles.grid}>
          {solutions.map((item, index) => (
            <article id={`industry-${index + 1}`} className={styles.card} key={item.title}>
              <div className={styles.cardLabel}><span>{item.industry}</span><span>0{index + 1}</span></div>
              <h3>{item.title}</h3><p>{item.description}</p>
              <ul>{item.scope.map(scope => <li key={scope}><Check size={15} aria-hidden="true" />{scope}</li>)}</ul>
              <Link className={styles.textLink} href={`/contact?source=work&interest=${encodeURIComponent(item.title)}`} aria-label={`Discuss the ${item.title} package`}>Discuss this scope <ArrowUpRight size={17} aria-hidden="true" /></Link>
            </article>
          ))}
        </div>
      </section>
      <section className={styles.closing} aria-labelledby="work-next">
        <div><p className={styles.eyebrow}>Your next project</p><h2 id="work-next">A different brief?</h2><p>Explore individual services or build a package around your priorities.</p></div>
        <div className={styles.actions}><Link className={styles.button} href="/contact">Discuss your project <ArrowUpRight size={18} aria-hidden="true" /></Link><Link className={styles.textLink} href="/services">Explore services <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
      </section>
      <ProjectQuestions variant="work" />
    </div></PageExperience>
  );
}
import { PageExperience } from "@/components/offerings/PageExperience";
import { ProjectQuestions } from "@/components/offerings/ProjectQuestions";
