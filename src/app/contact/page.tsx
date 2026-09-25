import { ArrowUpRight, Mail, MapPin, MessageSquare } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { CONTACT_EMAIL } from "@/lib/contact-details";
import styles from "./contact.module.css";

export const metadata = {
  title: "Contact & Start a Project | Vyara Amogya Technologies",
  description: "Get in touch with our team to start a new project, book studio time, or request a custom proposal.",
};

export default function ContactPage() {
  return (
    <PageExperience variant="contact"><div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroIcon}><MessageSquare size={24} aria-hidden="true" /></div>
        <p className={styles.eyebrow}>Start a conversation</p>
        <h1>Let&apos;s build what comes next.</h1>
        <p>Tell us where you are, where you want to go, and what is getting in the way. We will turn that into a clear first conversation.</p>
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}<ArrowUpRight size={19} aria-hidden="true" /></a>
      </header>

      <div className={styles.content}>
        <section className={styles.formPanel} aria-labelledby="project-brief-heading">
          <div className={styles.sectionHeading}><p className={styles.eyebrow}>Your brief</p><h2 id="project-brief-heading">A few details to begin.</h2></div>
          <ContactForm />
        </section>

        <aside className={styles.sidebar}>
          <div className={styles.sidePanel}>
            <p className={styles.eyebrow}>Direct inquiries</p>
            <h2>Prefer email?</h2>
            <a href={`mailto:${CONTACT_EMAIL}`}><Mail size={18} aria-hidden="true" /><span>{CONTACT_EMAIL}</span><ArrowUpRight size={18} aria-hidden="true" /></a>
          </div>
          <div className={styles.location}>
            <MapPin size={20} aria-hidden="true" />
            <div><strong>Bengaluru, Karnataka</strong><p>Strategy, design, technology and creative production from one Amoghya team.</p></div>
          </div>
          <div className={styles.steps}>
            <p className={styles.eyebrow}>What happens next</p>
            <ol><li><span>01</span><p>We review the brief.</p></li><li><span>02</span><p>We arrange a discovery call.</p></li><li><span>03</span><p>We define the scope and next step.</p></li></ol>
          </div>
        </aside>
      </div>
      <ProjectQuestions variant="contact" />
    </div></PageExperience>
  );
}
import { PageExperience } from "@/components/offerings/PageExperience";
import { ProjectQuestions } from "@/components/offerings/ProjectQuestions";
