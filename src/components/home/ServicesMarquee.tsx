import styles from "./ServicesMarquee.module.css";

const services = [
  "Brand Strategy", "Web Development", "AI & Automation", "Digital Marketing",
  "SEO", "Creative Production", "Apps & Software", "Analytics",
];

export function ServicesMarquee() {
  return (
    <div className={styles.strip} role="region" aria-label="Amoghya capabilities">
      <p className="sr-only">{services.join(", ")}</p>
      <div className={styles.window} aria-hidden="true">
        <div className={styles.track}>
          {[0, 1].map(copy => (
            <div className={styles.group} key={copy}>
              {services.map(service => <span className={styles.item} key={service}>{service}<span className={styles.separator}>·</span></span>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
