"use client";

import { useLayoutEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, X } from "lucide-react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import gsap from "gsap";
import { serviceRailData } from "./service-rail-data";
import styles from "./ServiceExplorer.module.css";

const groups = ["All services", "Brand & creative", "Technology & AI", "Growth & operations"];
const groupByNumber: Record<string, string> = {
  "01": groups[1], "07": groups[1], "08": groups[1],
  "02": groups[2], "03": groups[2], "04": groups[2], "05": groups[2], "09": groups[2],
  "06": groups[3], "10": groups[3], "11": groups[3],
};

export function ServiceExplorer() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState(groups[0]);
  const matches = serviceRailData.filter(service =>
    (group === groups[0] || groupByNumber[service.number] === group) &&
    [service.title, service.description, ...service.subServices].join(" ").toLowerCase().includes(query.trim().toLowerCase()));
  useLayoutEffect(() => { gsap.registerPlugin(ScrollTrigger); ScrollTrigger.refresh(); }, [query, group]);
  return <section className={styles.explorer} aria-labelledby="explore-services-heading">
    <div className={styles.heading}><div><p>What we do</p><h2 id="explore-services-heading">Find your starting point.</h2></div><p>One focused service or a connected scope. Explore what your business needs next.</p></div>
    <div className={styles.controls}>
      <div className={styles.filters} role="group" aria-label="Service discipline">{groups.map(item => <button key={item} type="button" aria-pressed={group === item} onClick={() => setGroup(item)}>{item}</button>)}</div>
      <div className={styles.search}><Search size={18} aria-hidden="true" /><input aria-label="Search services" placeholder="Search services" value={query} onChange={event => setQuery(event.target.value)} />{query && <button type="button" title="Clear search" aria-label="Clear search" onClick={() => setQuery("")}><X size={17} /></button>}</div>
    </div>
    <p className={styles.count} role="status">{matches.length} {matches.length === 1 ? "service" : "services"}</p>
    <div className={styles.results}>{matches.map(service => <Link key={service.slug} href={`/services/${service.slug}`}><span>{groupByNumber[service.number]}</span><h3>{service.title}</h3><p>{service.description}</p><ArrowUpRight size={22} aria-hidden="true" /></Link>)}</div>
    {!matches.length && <div className={styles.empty}><p>No services match this search.</p><button type="button" onClick={() => { setQuery(""); setGroup(groups[0]); }}>Reset filters</button></div>}
  </section>;
}
