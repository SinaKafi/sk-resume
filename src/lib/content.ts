/**
 * Single source of truth for every piece of copy on the site.
 * Derived from `agents/content.md` — edit here, not in the components.
 */

export type Highlight = {
  title: string;
  body: string;
};

export type Role = {
  company: string;
  role: string;
  location: string;
  period: string;
  /** Short framing paragraph shown under the company name. */
  summary?: string;
  highlights: Highlight[];
  stack: string[];
};

export type Project = {
  name: string;
  /** Short mark shown on the card tile, e.g. "TP" for ToranjPaz. */
  monogram: string;
  description: string;
  stack: string[];
  href?: string;
};

export type SkillGroup = {
  label: string;
  items: string[];
};

export const profile = {
  name: "Sina Kafi",
  role: "Senior Front-End Developer",
  tagline: "React • Next.js • TypeScript • Front-End Architecture • Design Systems",
  location: "Tehran, Iran",
  phone: "+98 912 943 8593",
  email: "sina.sk.kafi@gmail.com",
  availability: "Military Service: Completed",
  intro:
    "8+ years building scalable web applications, fintech platforms and complex business systems.",
  summary: [
    "Senior Front-End Developer with 8+ years of experience building scalable web applications, fintech platforms, and complex business systems using React, Next.js, and TypeScript.",
    "Experienced in front-end architecture, design systems, monorepos, and multi-application ecosystems. Proven expertise in modernizing build infrastructure, optimizing application performance, and developing reusable engineering foundations.",
    "Focused on technical ownership, maintainable architecture, type safety, developer experience, and delivering reliable, high-quality products through cross-functional collaboration.",
  ],
} as const;

export const links = {
  website: "https://sinakafi.com",
  linkedin: "https://linkedin.com/in/sina-kafi-0113231bb",
  github: "https://github.com/SinaKafi",
} as const;

export const telHref = `tel:${profile.phone.replace(/[^+\d]/g, "")}`;
export const mailHref = `mailto:${profile.email}`;

export const experience: Role[] = [
  {
    company: "SnappPay",
    role: "Senior Front-End Developer",
    location: "Tehran, Iran",
    period: "2024 – Present",
    summary:
      "Contribute as an Individual Contributor across SnappPay's front-end ecosystem, including Merchant Panel, PayLater, Material, Genesis, Back Office, UI Kit, Iconium, and shared front-end infrastructure. Own tasks end to end, from technical analysis and implementation to testing, delivery, and maintenance.",
    highlights: [
      {
        title: "Merchant Panel Development",
        body: "Developed and maintained a large-scale, role-based fintech Merchant Panel covering campaign management, promotions, orders, in-store payments, reporting, product management, settlements, merchant onboarding, user management, and Search Ads.",
      },
      {
        title: "End-to-End Task Ownership",
        body: "Managed front-end tasks from requirements analysis and technical planning through implementation, testing, code review, release, and maintenance, collaborating with product, design, back-end, and QA teams.",
      },
      {
        title: "Complex Business Workflows",
        body: "Built end-to-end promotion and campaign workflows, including product submission and approval, capacity management, bulk operations, CSV import/export, and time-limited post-registration access for merchants, account managers, and marketing teams.",
      },
      {
        title: "Data-Driven Interfaces",
        body: "Implemented scalable server-side pagination, filtering, and data management for reporting and order modules, including responsive data-grid footers, downloadable reports, resilient error handling, and permission-based actions.",
      },
      {
        title: "Performance Optimization",
        body: "Improved application performance and responsiveness through route-level code splitting, react-window virtualization, debounced and cancellable API requests using AbortController, and IntersectionObserver-based infinite scrolling.",
      },
      {
        title: "Build Infrastructure Modernization",
        body: "Migrated the Merchant Panel from CRA/Craco and Webpack to Vite and SWC while preserving runtime configuration, PWA behavior, environment-specific assets, Sentry releases and source maps, development tooling, and CI/CD compatibility.",
      },
      {
        title: "Design System Engineering",
        body: "Maintained and enhanced @snppay/ui, a versioned React and TypeScript design system with 50+ reusable components. Improved component APIs, type safety, theming, design tokens, RTL support, testing, documentation, and automated package publishing.",
      },
      {
        title: "Shared UI Infrastructure",
        body: "Contributed to shared front-end packages and application foundations, promoting reusable components, consistent UI patterns, maintainable APIs, and standardized development practices across multiple products.",
      },
      {
        title: "Icon Library Development",
        body: "Contributed to Iconium, a typed, tree-shakeable SVG icon library featuring 59 icons, theme support, and automated CI/CD publishing.",
      },
      {
        title: "Application Architecture",
        body: "Used and contributed to Genesis conventions for standardized React application development, including shared loading and error states, internationalization (i18n), Redux integration, and Super App integration patterns.",
      },
      {
        title: "Internal Tools & Back Office",
        body: "Developed internal Back Office and Data Entry applications supporting marketing, customer support, customer operations, reporting, campaign management, and bulk data workflows.",
      },
      {
        title: "Code Quality & Collaboration",
        body: "Participated in code reviews, technical discussions, cross-team alignment, and continuous improvements to shared front-end architecture, development workflows, and engineering standards.",
      },
      {
        title: "WordPress Plugin Development",
        body: "Developed WordPress plugins to extend platform functionality and integrate custom front-end experiences with WordPress-based environments.",
      },
    ],
    stack: [
      "React 18",
      "TypeScript",
      "JavaScript",
      "Redux Toolkit",
      "React Router",
      "Tailwind CSS",
      "daisyUI",
      "Material UI (MUI)",
      "React Hook Form",
      "Yup",
      "Framer Motion",
      "Vite",
      "SWC",
      "Webpack",
      "CRA/Craco",
      "WordPress",
      "REST APIs",
      "PWA",
      "Sentry",
      "react-window",
      "IntersectionObserver",
      "AbortController",
      "Git",
      "CI/CD",
      "RTL",
      "i18n",
    ],
  },
  {
    company: "Ayria",
    role: "Senior Front-End Developer",
    location: "Iran",
    period: "2024",
    highlights: [
      {
        title: "POS System Development",
        body: "Built a point-of-sale platform for chain stores, supporting inventory management, customer orders, financial reporting, and customer-facing landing pages.",
      },
      {
        title: "ERP & Accounting Modules",
        body: "Developed front-end modules for ERP and accounting systems, supporting business operations, financial data management, and reporting workflows.",
      },
      {
        title: "Bismart E-commerce",
        body: "Developed an e-commerce application using Next.js 14 App Router, Chakra UI, RTK Query, and Tailwind CSS, with a focus on reusable components and maintainable application architecture.",
      },
      {
        title: "Sanat Rayan Pars",
        body: "Delivered an e-commerce and corporate portfolio platform for a battery manufacturer, implementing multilingual support, reusable UI patterns, and responsive interfaces.",
      },
    ],
    stack: [
      "Next.js 14",
      "React",
      "TypeScript",
      "Zustand",
      "React Query",
      "RTK Query",
      "Chakra UI",
      "Tailwind CSS",
      "i18next",
      "REST APIs",
    ],
  },
  {
    company: "Novin Arzesh | Arzesh Wallet",
    role: "Front-End Tech Lead",
    location: "Iran",
    period: "2023 – 2024",
    highlights: [
      {
        title: "Exchange Platform Development",
        body: "Led front-end development for a multi-theme cryptocurrency exchange ecosystem built with Next.js, comprising customer-facing applications, two admin panels, a back-office system, and campaign management tools.",
      },
      {
        title: "Authentication & Route Protection",
        body: "Implemented authentication flows in Next.js using JWT and refresh tokens, with middleware-based route protection and access control.",
      },
      {
        title: "Monorepo Architecture",
        body: "Introduced and implemented Turborepo to consolidate multiple applications and shared packages, streamline dependency management, improve code reuse, and standardize development workflows.",
      },
      {
        title: "IBaar Logistics Platform",
        body: "Developed IBaar, a logistics and delivery management platform for Foolad Mobarake, covering delivery management workflows, driver-facing applications, customer experiences, provider interfaces, and administrative panels.",
      },
      {
        title: "PlussMad Healthcare Platform",
        body: "Built a healthcare appointment platform with dedicated customer, healthcare provider, and admin panels within a shared monorepo architecture.",
      },
      {
        title: "Technical Leadership",
        body: "Led front-end delivery across multiple products, established reusable architectural patterns, and improved consistency and maintainability across applications.",
      },
    ],
    stack: [
      "Next.js 12/13",
      "React",
      "TypeScript",
      "JWT",
      "refresh tokens",
      "middleware",
      "Turborepo",
      "Chakra UI",
      "Ant Design",
      "Tailwind CSS",
      "Zustand",
      "React Query",
      "RTK Query",
      "TradingView",
      "Mapbox",
      "Leaflet",
    ],
  },
  {
    company: "Sabke Zendegi Khalagh | Mihan",
    role: "Senior Front-End Developer",
    location: "Iran",
    period: "2022 – 2023",
    highlights: [
      {
        title: "E-commerce & Q-commerce Development",
        body: "Developed AlinLand e-commerce and MyRocket/Aldy Q-commerce platforms, supporting online shopping, quick-commerce operations, and end-to-end order management workflows.",
      },
      {
        title: "Admin Panel Development",
        body: "Built and maintained six back-office applications across the e-commerce and Q-commerce ecosystems, supporting administrative operations, business management, and platform-specific workflows.",
      },
      {
        title: "Campaign & Promotion Management",
        body: "Developed campaign management modules and promotional workflows to support marketing operations, campaign configuration, and promotion administration.",
      },
      {
        title: "Operations Management",
        body: "Developed TM Manager, an operations platform for dark stores, logistics, and order management, helping coordinate operational workflows and order fulfillment.",
      },
    ],
    stack: [
      "Next.js 12",
      "React",
      "TypeScript",
      "Apollo Client",
      "Redux Saga",
      "Redux Thunk",
      "Axios",
      "Material UI (MUI)",
      "Ant Design",
      "Tailwind CSS",
      "Mapbox",
    ],
  },
  {
    company: "IT Saaz",
    role: "Senior Front-End Developer",
    location: "Iran",
    period: "2021 – 2022",
    highlights: [
      {
        title: "Government Services Super App",
        body: "Developed a government-services Progressive Web App (PWA), delivering user-facing features and supporting administrative tools.",
      },
      {
        title: "KYC & Identity Verification",
        body: "Built KYC provider portals and identity verification workflows for individuals and legal entities, supporting authentication and verification processes.",
      },
      {
        title: "Digital Signature Systems",
        body: "Developed front-end features for digital signature platforms and secure identity verification workflows.",
      },
      {
        title: "Labor Administration Platforms",
        body: "Built web applications and administrative panels for government labor services, supporting employee, employer, and office workflows.",
      },
      {
        title: "Online Judicial Services",
        body: "Developed an online judicial complaint submission platform and supporting administrative interfaces.",
      },
      {
        title: "Admin Panels & Internal Tools",
        body: "Implemented dashboards and operational tools for authentication management, government-office operations, and internal workflows.",
      },
      {
        title: "React Native PoC",
        body: "Developed a proof of concept for the OnlineAI service using React Native to explore cross-platform mobile application capabilities.",
      },
    ],
    stack: [
      "Next.js 12",
      "React",
      "TypeScript",
      "Apollo Client",
      "Redux Saga",
      "Redux Thunk",
      "Axios",
      "Material UI (MUI)",
      "Ant Design",
      "Tailwind CSS",
      "Mapbox",
    ],
  },
  {
    company: "Erfan Salamat",
    role: "Front-End Developer",
    location: "Iran",
    period: "2020 – 2021",
    highlights: [
      {
        title: "Abish Healthcare Platform",
        body: "Developed a healthcare platform for VIP medical services and home visits, including a customer-facing PWA, healthcare provider portal, administrative panel, and logistics management system.",
      },
      {
        title: "Business Process Management",
        body: "Contributed to Agile-BPMS, a business-process management product built with React and C#, developing front-end features for business workflows and process management.",
      },
      {
        title: "Cross-Functional Development",
        body: "Collaborated on multi-interface applications, implementing reusable UI components, form workflows, API integrations, and responsive user experiences.",
      },
    ],
    stack: [
      "Next.js",
      "React",
      "Redux Saga",
      "Redux Thunk",
      "Axios",
      "Formik",
      "Yup",
      "Material UI (MUI)",
      "Ant Design",
      "Sass",
      "Mapbox",
      "C#",
    ],
  },
  {
    company: "NetCollege",
    role: "Front-End / Android Developer",
    location: "Iran",
    period: "2018 – 2019",
    highlights: [
      {
        title: "ClassReminder Android App",
        body: "Developed a native Android application enabling teachers to manage classes, organize schedules, and track teaching activities.",
      },
      {
        title: "WordPress Development",
        body: "Designed and developed the NetCollege Bartar landing page using WordPress, delivering a web presence tailored to the platform's needs.",
      },
    ],
    stack: ["Android Studio", "Java", "Kotlin", "XML", "WordPress"],
  },
];

export const projects: Project[] = [
  {
    name: "AinoAI",
    monogram: "AI",
    description:
      "An AI management dashboard providing a centralized interface for managing AI services and platform operations.",
    stack: ["React 18", "TypeScript", "Redux Toolkit", "Tailwind CSS"],
    href: "https://ainoai.com",
  },
  {
    name: "ToranjPaz",
    monogram: "TP",
    description:
      "An administrative platform for organizational food services, supporting the management of corporate meal operations.",
    stack: ["Next.js", "TypeScript", "Chakra UI", "Turborepo"],
  },
  {
    name: "Mehr Iran Bank (QMB)",
    monogram: "MB",
    description:
      "The bank's landing page, delivering a responsive user interface aligned with its digital presence and branding.",
    stack: ["Next.js", "TypeScript", "React Query", "Tailwind CSS"],
    href: "https://www.qmb.ir",
  },
];

export const skillGroups: SkillGroup[] = [
  {
    label: "Front-End",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "React Native",
      "Vue.js",
      "Angular",
    ],
  },
  {
    label: "State Management & Data",
    items: [
      "Redux Toolkit",
      "RTK Query",
      "React Query",
      "Zustand",
      "Redux Saga",
      "Apollo Client",
      "REST",
      "GraphQL",
      "WebSocket",
    ],
  },
  {
    label: "UI & Design Systems",
    items: [
      "Tailwind CSS",
      "daisyUI",
      "Material UI",
      "Chakra UI",
      "Ant Design",
      "Sass",
      "Less",
      "Design Tokens",
      "RTL",
      "Responsive Design",
    ],
  },
  {
    label: "Architecture",
    items: [
      "Component-Driven Architecture",
      "Monorepos",
      "PWA",
      "SSR",
      "SSG",
      "ISR",
      "Role-Based Applications",
      "Multi-Brand Applications",
    ],
  },
  {
    label: "Performance Optimization",
    items: [
      "Code Splitting",
      "Lazy Loading",
      "Virtualization",
      "Debouncing",
      "Request Cancellation",
      "Infinite Scrolling",
    ],
  },
  {
    label: "Tooling & Quality",
    items: [
      "Vite",
      "SWC",
      "Webpack",
      "Turborepo",
      "Git",
      "Docker",
      "Jest",
      "Cypress",
      "Sentry",
      "GitLab CI/CD",
    ],
  },
  {
    label: "Forms & Validation",
    items: ["React Hook Form", "Formik", "Yup", "Zod"],
  },
  {
    label: "Back-End Familiarity",
    items: [
      "Node.js",
      "Express.js",
      "Java",
      "Spring Boot",
      "MongoDB",
      "MySQL",
    ],
  },
];

export const additional = {
  languages: [
    { name: "Persian", level: "Native" },
    { name: "English", level: "Professional Working Proficiency" },
  ],
};

/** Headline numbers shown as glass stat tiles in the hero. */
export const stats = [
  { value: "8+", label: "Years of experience" },
  { value: "50+", label: "Design-system components" },
  { value: "7", label: "Companies & products" },
];

export const navItems = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
] as const;
