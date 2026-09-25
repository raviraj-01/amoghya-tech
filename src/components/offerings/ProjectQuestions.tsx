"use client";

import { useId, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import { Plus } from "lucide-react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import styles from "./ProjectQuestions.module.css";

const questions = {
  work: [
    ["Can we combine services?", "Yes. Branding, technology and creative production can be brought together around your business. The industry scopes are starting points, not fixed requirements."],
    ["Are these completed client projects?", "These are available industry solutions, not completed client case studies. We will discuss the relevant scope for your project before work begins."],
    ["What should I bring to the first conversation?", "Your business goals, current website or brand assets, priorities and target timeline are a useful starting point."],
  ],
  studio: [
    ["How does a shoot begin?", "We begin with a pre-shoot planning call to discuss the subject, location, intended formats and target date."],
    ["What is included in production?", "The essentials include planning, the agreed on-location shoot, basic colour correction and editing, and final files for the agreed web or print uses."],
    ["Can a shoot support several channels?", "Share the channels you need before production. Photography, reels, brand films and edited variations can be planned together within an agreed scope."],
  ],
  about: [
    ["Why bring different disciplines together?", "Shared business context keeps branding, design, engineering and content connected, reducing repeated explanations between different parts of your project."],
    ["Where is Amoghya based?", "We are based in Bengaluru, Karnataka, working across strategy, technology and creative production."],
    ["Can we start with a smaller project?", "Yes. Begin with a focused service or first launch, then discuss a wider scope as your business needs develop."],
  ],
  contact: [
    ["Do I need a complete brief?", "No. Start with your goals and the problems you want to solve. Business consulting can help clarify the direction when the brief is still taking shape."],
    ["Can I contact the team directly?", "Yes. Use the email link on this page to start a conversation with the team."],
    ["How is the scope agreed?", "We discuss your priorities, relevant services, deliverables and timeline before agreeing the scope and next step."],
  ],
};

export function ProjectQuestions({ variant }: { variant: keyof typeof questions }) {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [open]);
  return <section className={styles.questions} aria-labelledby={`${id}-heading`}>
    <div className={styles.heading}><p>Before we begin</p><h2 id={`${id}-heading`}>A little clarity.<br />A better start.</h2></div>
    <div>{questions[variant].map(([question, answer], index) => <div className={styles.item} key={question}>
      <h3><button type="button" id={`${id}-q-${index}`} aria-expanded={open === index} aria-controls={`${id}-a-${index}`} onClick={() => setOpen(open === index ? null : index)}>{question}<Plus size={20} aria-hidden="true" /></button></h3>
      <div id={`${id}-a-${index}`} role="region" aria-labelledby={`${id}-q-${index}`} aria-hidden={open !== index} className={styles.answer} data-open={open === index} onTransitionEnd={event => { if (event.target === event.currentTarget) ScrollTrigger.refresh(); }}><div><p>{answer}</p></div></div>
    </div>)}</div>
  </section>;
}
