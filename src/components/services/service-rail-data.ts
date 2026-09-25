// Source: Amoghya_Technologies_Customer_Pricing_Offers.docx, sections 5-15.
// Category names follow the approved Service Rail brief; no launch offers are used.
const categories = [
  { number: "01", title: "Brand Strategy & Identity", description: "A clear position and a consistent identity, built before your next campaign or platform.", subServices: ["Brand Strategy (positioning & messaging)", "Logo Design", "Visual Identity", "Brand Guidelines Document"] },
  { number: "02", title: "Website Development", description: "Websites that turn attention into action, from focused landing pages to connected commerce platforms.", subServices: ["Business Websites", "E-commerce Platforms", "Booking & Reservation Systems", "CMS Development"] },
  { number: "03", title: "Mobile Application Development", description: "Mobile experiences for your customers and your team, built around the way they work.", subServices: ["Android Applications", "iOS Applications", "Cross-Platform Apps", "Customer Engagement Apps"] },
  { number: "04", title: "Custom Software Solutions", description: "Purpose-built software that connects your people, information and everyday operations.", subServices: ["CRM Development", "ERP Systems", "Inventory Management", "Admin Dashboards"] },
  { number: "05", title: "Artificial Intelligence Solutions", description: "Practical AI tools that reduce manual work and make customer support more responsive.", subServices: ["AI Customer Support", "AI Business Assistants", "Predictive Analytics", "AI Knowledge Base Systems"] },
  { number: "06", title: "Digital Marketing", description: "Connected search, social and messaging campaigns with a clear view of what is working.", subServices: ["Social Media Marketing", "Search Engine Optimization (SEO)", "Lead Generation Campaigns", "Marketing Analytics & Reporting"] },
  { number: "07", title: "Creative Content Production", description: "Photography, film and motion that give your brand something worth paying attention to.", subServices: ["Product Photography", "Brand Films", "Social Media Reels", "Motion Graphics"] },
  { number: "08", title: "UI/UX Design", description: "Research-led interfaces that make complex products feel clear, useful and considered.", subServices: ["Website UI Design", "Mobile App UI Design", "Interactive Prototyping", "Design Systems"] },
  { number: "09", title: "Cloud & Technology Services", description: "The infrastructure, integrations and security that keep your digital platforms running reliably.", subServices: ["Cloud Deployment", "API Development & Integration", "Database Architecture", "Security Implementation"] },
  { number: "10", title: "Business Automation", description: "Connect the tools you already use and remove repetitive work from your daily workflows.", subServices: ["CRM Automation", "Sales Automation", "Document Automation", "Reporting Dashboards"] },
  { number: "11", title: "Business Consulting", description: "An outside perspective and a practical roadmap for your next stage of growth.", subServices: ["Technology Consulting", "Business Process Analysis", "Product Strategy", "Technology Roadmaps"] },
] as const;

export function serviceSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const serviceRailData = categories.map(category => ({
  ...category,
  slug: serviceSlug(category.title),
}));

// Descriptions expand only the verified sub-services listed above.
const scopeDescriptions: Record<string, readonly string[]> = {
  "01": ["Define your positioning, audience and core messages so every touchpoint tells the same story.", "Develop a recognizable logo with practical variations for digital and print use.", "Bring colour, typography and brand assets into a coherent visual identity.", "Document how the identity should be used so your team can maintain consistency."],
  "02": ["Present your business, services and enquiry paths in a responsive website.", "Connect product discovery, catalogue management and checkout in one shopping experience.", "Build booking journeys around availability, reservations and customer information.", "Give your team a structured way to publish and maintain website content."],
  "03": ["Create an Android experience around your core customer or operational workflows.", "Design and develop an iOS application with a clear, platform-appropriate interface.", "Build a shared mobile experience for Android and iOS around a common codebase.", "Connect customers with your business through useful mobile interactions and updates."],
  "04": ["Organize customer information, sales activity and follow-ups in a custom CRM.", "Connect core business processes and information across teams in an ERP system.", "Track stock and inventory activity with workflows that fit your operations.", "Give your team a focused workspace for managing data, users and day-to-day tasks."],
  "05": ["Support customer questions with AI-powered flows connected to relevant business information.", "Create assistants that help your team retrieve information and complete routine tasks.", "Use business data to explore trends and support forecasting and planning decisions.", "Make internal knowledge easier to retrieve through an AI-enabled information system."],
  "06": ["Plan and manage your social channels around a consistent brand voice and content calendar.", "Improve search visibility through website, content and technical SEO work.", "Connect campaign messages and enquiry journeys to attract relevant prospective customers.", "Bring campaign results into clear reporting that informs the next set of decisions."],
  "07": ["Plan and photograph products for websites, catalogues and campaign assets.", "Tell your brand's story through a film shaped around its audience and purpose.", "Produce short-form social videos with a consistent creative direction.", "Use animated graphics to explain ideas and bring campaign messages into motion."],
  "08": ["Design website interfaces with clear content hierarchy and usable navigation.", "Shape mobile screens and interactions around the tasks your users need to complete.", "Connect key screens into a working prototype to review journeys before development.", "Create reusable interface components and guidance for consistent product design."],
  "09": ["Set up your application in a cloud environment suited to its operational requirements.", "Develop APIs and connect platforms so information can move between your tools.", "Structure application data and relationships around your platform's needs.", "Review and harden your platform's security configuration and access controls."],
  "10": ["Connect CRM updates and follow-ups to reduce repetitive data entry and missed handovers.", "Automate repeatable sales steps across your existing tools and processes.", "Streamline the creation and movement of documents through routine workflows.", "Bring operational information into dashboards your team can use for regular reporting."],
  "11": ["Review technology choices against your business needs and implementation constraints.", "Map current processes, identify friction and prioritize opportunities for improvement.", "Clarify a product's audience, core value and priorities before committing to a build.", "Turn technology priorities into a sequenced plan for implementation and investment."],
};

export function getSubServices(service: typeof serviceRailData[number]) {
  return service.subServices.map((title, index) => ({
    title,
    id: serviceSlug(title),
    description: scopeDescriptions[service.number][index],
  }));
}
