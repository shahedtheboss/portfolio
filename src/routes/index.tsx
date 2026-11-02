import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ChevronDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Award,
  BadgeCheck,
  Brain,
  CircuitBoard,
  Cpu,
  Eye,
  Factory,
  FileText,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  Menu,
  Network,
  ScanLine,
  X,
  Youtube,
} from "lucide-react";

import portraitAsset from "@/assets/portrait.jpg.asset.json";
import projectRobotAsset from "@/assets/project-robot.png.asset.json";
import projectVision from "@/assets/project-vision.jpg";
import projectAutomation from "@/assets/project-automation.jpg";
import projectMl from "@/assets/project-ml.jpg";
import projectWeb from "@/assets/project-web.jpg";
import projectRfidAsset from "@/assets/project-rfid.png.asset.json";
import projectChat from "@/assets/project-chat.jpg";
import projectRestaurantAsset from "@/assets/project-restaurant.jpg.asset.json";
import projectOledAsset from "@/assets/project-oled.png.asset.json";
import projectFrozenlakeAsset from "@/assets/project-frozenlake.jpg.asset.json";
import projectMlopsAsset from "@/assets/project-mlops.jpg.asset.json";
import projectSecomAsset from "@/assets/project-secom.jpg.asset.json";
import projectDigitsAsset from "@/assets/project-digits.jpg.asset.json";
import projectDistanceAsset from "@/assets/project-distance.jpg.asset.json";
import projectEmpAsset from "@/assets/project-emp.jpg.asset.json";
import projectTodoAsset from "@/assets/project-todo.png.asset.json";
import projectPlcAsset from "@/assets/project-plc.jpg.asset.json";
import visitPowerStation1 from "@/assets/visit-power-station-1.png.asset.json";
import visitPowerStation2 from "@/assets/visit-power-station-2.png.asset.json";
import visitTranscom1 from "@/assets/visit-transcom-1.png.asset.json";
import visitTranscom2 from "@/assets/visit-transcom-2.png.asset.json";
import { Button } from "@/components/ui/button";
import certMlContest from "@/assets/cert-ml-contest.png.asset.json";
import certIndustrialAutomation from "@/assets/cert-industrial-automation.png.asset.json";
import certSciblitz from "@/assets/cert-sciblitz.png.asset.json";
import certMieRobolution from "@/assets/cert-mie-robolution.png.asset.json";
import certDatathonJpg from "@/assets/cert-datathon.jpg.asset.json";
import certDatathonPdf from "@/assets/cert-datathon.pdf.asset.json";
import certPytorchJpg from "@/assets/cert-pytorch.jpg.asset.json";
import certPytorchPdf from "@/assets/cert-pytorch.pdf.asset.json";

import {
  aboutThemes,
  certifications,
  education,
  experience,
  identity,
  identityCard,
  journey,
  projectCategories,
  projects,
  researchInterests,
  skillGroups,
  type Certification,
  type Project,
} from "@/data/portfolio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Md. Shahdath Hussain | Web Development, AI & Robotics" },
      {
        name: "description",
        content:
          "Portfolio of Md. Shahdath Hussain — EEE undergraduate at CUET and web developer with 6 years of experience, expanding into AI, reinforcement learning, robotics, and intelligent control systems.",
      },
      { property: "og:title", content: "Md. Shahdath Hussain | Web Development, AI & Robotics" },
      {
        property: "og:description",
        content:
          "From building for the web to building intelligent systems — EEE student at CUET exploring AI, robotics, and reinforcement learning.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://shahdath-hussain.lovable.app/" },
      { property: "og:image", content: `https://shahdath-hussain.lovable.app${portraitAsset.url}` },
      { name: "twitter:image", content: `https://shahdath-hussain.lovable.app${portraitAsset.url}` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://shahdath-hussain.lovable.app/" }],
  }),
  component: Portfolio,
});

const projectImages: Record<Project["image"], string | readonly [string, string]> = {
  robot: projectRobotAsset.url,
  vision: projectVision,
  automation: projectAutomation,
  ml: projectMl,
  web: projectWeb,
  rfid: projectRfidAsset.url,
  chat: projectChat,
  restaurant: projectRestaurantAsset.url,
  oled: projectOledAsset.url,
  frozenlake: projectFrozenlakeAsset.url,
  mlops: projectMlopsAsset.url,
  secom: projectSecomAsset.url,
  digits: projectDigitsAsset.url,
  distance: projectDistanceAsset.url,
  emp: projectEmpAsset.url,
  todo: projectTodoAsset.url,
  plc: projectPlcAsset.url,
  powerStationVisit: [visitPowerStation1.url, visitPowerStation2.url],
  transcomVisit: [visitTranscom1.url, visitTranscom2.url],
};

const certificationMedia: Record<
  Certification["key"],
  { thumb: string; full: string; width: number; height: number; isPdf?: boolean }
> = {
  mlContest: { thumb: certMlContest.url, full: certMlContest.url, width: 1280, height: 960 },
  industrialAutomation: {
    thumb: certIndustrialAutomation.url,
    full: certIndustrialAutomation.url,
    width: 480,
    height: 360,
  },
  sciblitz: { thumb: certSciblitz.url, full: certSciblitz.url, width: 1080, height: 797 },
  mieRobolution: {
    thumb: certMieRobolution.url,
    full: certMieRobolution.url,
    width: 480,
    height: 360,
  },
  datathon: {
    thumb: certDatathonJpg.url,
    full: certDatathonPdf.url,
    width: 1755,
    height: 1241,
    isPdf: true,
  },
  pytorchBootcamp: {
    thumb: certPytorchJpg.url,
    full: certPytorchPdf.url,
    width: 1200,
    height: 900,
    isPdf: true,
  },
};

const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "research", label: "Research" },
  { id: "experience", label: "Experience" },
  { id: "certifications", label: "Certifications" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" },
];

const researchIcons = [Brain, Cpu, Eye, Factory];

/* Reveal-on-scroll wrapper */
function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${visible ? "animate-reveal" : "opacity-0"} ${className}`}>
      {children}
    </div>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: ReactNode }) {
  return (
    <div className="mb-12 max-w-2xl">
      <p className="font-mono text-xs tracking-[0.25em] text-primary">{"// "}{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors ${
        scrolled ? "border-border bg-background/90 backdrop-blur-md" : "border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6" aria-label="Main">
        <a href="#home" className="flex min-w-0 items-center gap-2 font-mono text-sm font-semibold text-foreground">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-primary/50 bg-card font-display text-xs text-primary glow-primary">
            {identity.monogram}
          </span>
          <span className="truncate font-display text-[15px] font-bold tracking-tight text-foreground sm:text-sm">
            {identity.name}
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) =>
            item.id === "projects" ? (
              <li key={item.id} className="group relative">
                <a
                  href="#projects"
                  aria-haspopup="true"
                  className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-primary group-focus-within:text-primary"
                >
                  {item.label}
                  <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                </a>
                <ul className="invisible absolute left-0 top-full z-50 w-72 translate-y-1 rounded-lg border border-border bg-card p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  {projectCategories.map((c) => (
                    <li key={c.key}>
                      <a
                        href={`#projects-${c.key}`}
                        onClick={(e) => e.currentTarget.blur()}
                        className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        {c.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {item.label}
                </a>
              </li>
            ),
          )}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#projects"
            className="hidden rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:inline-flex"
          >
            Explore Projects
          </a>
          <button
            className="rounded-md p-2 text-foreground lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <ul className="border-t border-border bg-background px-4 py-3 lg:hidden">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:text-primary"
              >
                {item.label}
              </a>
              {item.id === "projects" && (
                <ul className="mb-1 ml-4 border-l border-border pl-2">
                  {projectCategories.map((c) => (
                    <li key={c.key}>
                      <a
                        href={`#projects-${c.key}`}
                        onClick={() => setOpen(false)}
                        className="block rounded-md px-3 py-2 text-xs text-muted-foreground hover:text-primary"
                      >
                        {c.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-16">
      <div className="absolute inset-0 bg-engineering-grid opacity-40" aria-hidden="true" />
      <div
        className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-28">
        <div className="order-2 lg:order-1">
          <p className="font-mono text-xs tracking-[0.25em] text-primary">{identity.eyebrow}</p>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {identity.headlineA}{" "}
            <span className="text-gradient">{identity.headlineB}</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            {identity.intro}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Explore My Projects <ArrowRight size={16} />
            </a>
            <a
              href="#about"
              className="rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/50"
            >
              About Me
            </a>
            <a
              href="#contact"
              className="rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/50"
            >
              Connect With Me
            </a>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <a
              href={identity.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <Github size={20} />
            </a>
            <a
              href={identity.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profile"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <Linkedin size={20} />
            </a>
            <a
              href={identity.youtube}
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube channel"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <Youtube size={20} />
            </a>
          </div>

          <p className="mt-8 inline-flex max-w-full items-start gap-2 rounded-full border border-border bg-card px-4 py-2 font-mono text-xs leading-relaxed text-muted-foreground">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary animate-pulse-dot" aria-hidden="true" />
            {identity.status}
          </p>
        </div>

        <div className="relative order-1 lg:order-2">
          <div className="relative overflow-hidden rounded-2xl border border-primary/40 glow-primary">
            <img
              src={portraitAsset.url}
              alt="Md. Shahdath Hussain photographed on a hilltop above a sea of clouds"
              width={450}
              height={610}
              className="h-auto max-h-[460px] w-full object-cover object-top sm:max-h-[560px] lg:max-h-[640px]"
            />
          </div>
          <div className="absolute -bottom-6 -left-4 right-4 rounded-xl border border-border bg-card/95 p-4 backdrop-blur sm:right-auto sm:w-80">
            <p className="font-mono text-[10px] tracking-[0.2em] text-primary">IDENTITY</p>
            <dl className="mt-2 space-y-1.5">
              {identityCard.map((row) => (
                <div key={row.label} className="flex gap-2 text-xs">
                  <dt className="w-20 shrink-0 font-mono text-muted-foreground">{row.label}</dt>
                  <dd className="text-foreground">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="ABOUT ME" title="How I Think & What Drives Me" />
        </Reveal>
        <Reveal className="max-w-3xl">
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              I'm naturally curious, enjoy solving challenging problems, and believe in learning
              through experimentation. I like understanding the logic behind things, testing ideas,
              and continuously improving through practice.
            </p>
            <p>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">My mindset —</span>{" "}
              Analytical, hands-on, and always learning. I value creative problem-solving, strategic
              thinking, and sharing knowledge with others.
            </p>
            <p>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">Beyond technology —</span>{" "}
              I'm passionate about competitive gaming, where strategy and quick decisions matter, and
              adventure, which gives me opportunities to explore, embrace challenges, and step
              outside my comfort zone.
            </p>
            <p>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">What drives me —</span>{" "}
              The satisfaction of overcoming difficult challenges, discovering something new, and
              turning ideas into something meaningful.
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-16">
          <span className="block h-px w-16 bg-primary/60" aria-hidden="true" />
          <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            My Passion and Goals
          </h3>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {aboutThemes.map((theme) => (
              <div
                key={theme.title}
                className="card-lift h-full rounded-xl border border-border bg-card p-5"
              >
                <h4 className="font-display text-sm font-semibold text-primary">{theme.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{theme.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Research() {
  return (
    <section id="research" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="RESEARCH INTERESTS"
            title={
              <>
                Where Engineering <span className="text-gradient">Meets Intelligence</span>
              </>
            }
          />
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2">
          {researchInterests.map((interest, i) => {
            const Icon = researchIcons[i % researchIcons.length] ?? Brain;
            return (
              <Reveal key={interest.key}>
                <article className="card-lift h-full rounded-xl border border-border bg-card p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/40 bg-background text-primary">
                      <Icon size={20} />
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      DIRECTION {interest.key}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                    {interest.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{interest.body}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {interest.topics.map((topic) => (
                      <li
                        key={topic}
                        className="rounded-full border border-border bg-background px-3 py-1 font-mono text-[11px] text-muted-foreground"
                      >
                        {topic}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="TECHNICAL SKILLS" title="Tools of the trade, honestly labeled" />
        </Reveal>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <Reveal key={group.title}>
              <div className="card-lift h-full rounded-xl border border-border bg-card p-6">
                <p className="font-mono text-[10px] tracking-[0.2em] text-primary">
                  {group.level.toUpperCase()}
                </p>
                <h3 className="mt-2 font-display text-base font-semibold text-foreground">
                  {group.title}
                </h3>
                <ul className="mt-4 space-y-2">
                  {group.skills.map((skill) => (
                    <li key={skill} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCategorySection({ category }: { category: (typeof projectCategories)[number] }) {
  const [expanded, setExpanded] = useState(false);
  const items = projects.filter((p) => p.category === category.key);
  const projectCount = items.filter((p) => p.kind !== "industrialVisit").length;
  const visitCount = items.length - projectCount;
  const shown = expanded ? items : items.slice(0, 2);
  const remaining = items.length - shown.length;
  const remainingVisits = items.slice(shown.length).filter((p) => p.kind === "industrialVisit").length;
  const remainingLabel = remainingVisits === remaining ? (remaining === 1 ? "industrial visit" : "industrial visits") : (remaining === 1 ? "project" : "projects");

  return (
    <div id={`projects-${category.key}`} className="scroll-mt-24">
      <Reveal>
        <div className="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-border pb-3">
          <h3 className="font-display text-2xl font-bold tracking-tight text-foreground">{category.label}</h3>
          <span className="font-mono text-xs tracking-[0.2em] text-primary">
            {projectCount} {projectCount === 1 ? "PROJECT" : "PROJECTS"}
          </span>
          {visitCount > 0 && (
            <span className="font-mono text-xs tracking-[0.2em] text-primary">
              {visitCount} {visitCount === 1 ? "INDUSTRIAL VISIT" : "INDUSTRIAL VISITS"}
            </span>
          )}
        </div>
      </Reveal>
      <div className="grid gap-6 md:grid-cols-2">
        {shown.map((project) => (
        <Reveal key={project.title}>
          <article className="card-lift group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
            <div className="relative overflow-hidden">
              {typeof projectImages[project.image] === "string" ? <img
                src={projectImages[project.image] as string}
                alt={`Illustration for ${project.title}`}
                loading="lazy"
                width={1200}
                height={800}
                className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              /> : (
                <div className="grid aspect-[3/2] grid-cols-2 gap-1 overflow-hidden bg-background">
                  {Array.from(projectImages[project.image]).map((src, index) => (
                    <img key={src} src={src} alt={`${project.title} — photo ${index + 1}`}
                      loading="lazy" width={600} height={800}
                      className="h-full min-h-0 w-full object-contain" />
                  ))}
                </div>
              )}
              <span
                className={`absolute left-4 top-4 rounded-full border px-3 py-1 font-mono text-[10px] tracking-wider backdrop-blur ${
                  project.status.startsWith("Completed")
                    ? "border-primary/50 bg-background/80 text-primary"
                    : project.status === "In Progress"
                      ? "border-secondary/60 bg-background/80 text-secondary"
                      : "border-border bg-background/80 text-muted-foreground"
                }`}
              >
                {project.status.toUpperCase()}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <p className="font-mono text-[10px] tracking-[0.2em] text-primary">
                {project.categoryLabel.toUpperCase()}
              </p>
              <h3 className="mt-2 font-display text-lg font-semibold text-foreground">
                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-primary"
                  >
                    {project.title}
                  </a>
                ) : (
                  project.title
                )}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {project.summary}
              </p>
              <ul className="mt-4 space-y-1.5">
                {project.details.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <ScanLine size={12} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                    {d}
                  </li>
                ))}
              </ul>
              <ul className="mt-4 flex flex-wrap gap-2 pt-2">
                {project.tech.map((t) => (
                  <li
                    key={t}
                    className="rounded border border-border bg-background px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                  >
                    {t}
                  </li>
                ))}
              </ul>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-auto inline-flex items-center gap-2 pt-5 font-mono text-xs text-primary transition-colors hover:underline"
                >
                  {project.kind === "industrialVisit" ? <Linkedin size={14} /> : <Github size={14} />}
                  {project.kind === "industrialVisit" ? "View post on LinkedIn" : "View source on GitHub"}
                </a>
              )}
            </div>
          </article>
        </Reveal>
      ))}

      </div>
      {(remaining > 0 || (expanded && items.length > 2)) && (
        <div className="mt-6 flex justify-center">
          <Button variant="outline"
            onClick={() => {
              if (expanded) {
                document.getElementById(`projects-${category.key}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }
              setExpanded(!expanded);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-primary bg-primary/10 px-5 py-2.5 font-mono text-xs text-primary transition-colors hover:bg-primary/20"
          >
            {expanded ? (
              <>
                View less <ArrowUp size={16} />
              </>
            ) : (
              <>
                View more ({remaining} more {remainingLabel}) <ArrowRight size={16} />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

function Projects() {
  return (
    <section id="projects" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="FEATURED PROJECTS" title="Work in progress, work in production" />
          <p className="-mt-8 mb-10 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm text-muted-foreground">
            All project details and source codes are available in my GitHub:
            <a
              href={identity.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-4 py-1.5 font-mono text-xs text-primary transition-colors hover:bg-primary/20"
            >
              <Github size={14} />
              Visit my GitHub
            </a>
          </p>
        </Reveal>

        <div className="space-y-16">
          {projectCategories.map((c) => (
            <ProjectCategorySection key={c.key} category={c} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="EXPERIENCE" title="Experience & engineering exposure" />
        </Reveal>
        <div className="grid gap-5 md:grid-cols-2">
          {experience.map((item) => (
            <Reveal key={item.title}>
              <article className="card-lift h-full rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-[10px] tracking-[0.2em] text-primary">
                    {item.kind.toUpperCase()}
                  </p>
                  <span className="font-mono text-[10px] text-muted-foreground">{item.period}</span>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          <div className="rounded-xl border border-border bg-card p-6 sm:flex sm:items-center sm:gap-6">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-primary/40 bg-background text-primary">
              <GraduationCap size={22} />
            </span>
            <div className="mt-4 sm:mt-0">
              <h3 className="font-display text-base font-semibold text-foreground">
                {education.institution}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {education.program} · {education.status} · {education.graduation}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Journey() {
  return (
    <section id="journey" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="LEARNING JOURNEY"
            title="From Engineering Fundamentals to Intelligent Systems"
          />
        </Reveal>
        <ol className="relative space-y-6 border-l border-border pl-6">
          {journey.map((item) => (
            <Reveal key={item.step}>
              <li className="relative">
                <span
                  className={`absolute -left-[31px] top-1 h-2.5 w-2.5 rounded-full border ${
                    item.status === "in-progress"
                      ? "border-primary bg-primary ring-2 ring-primary/40"
                      : item.status === "completed"
                        ? "border-primary bg-primary"
                        : "border-muted-foreground bg-background"
                  }`}
                  aria-hidden="true"
                />
                <div className="card-lift rounded-xl border border-border bg-card p-5">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-primary">{item.step}</span>
                    <h3 className="font-display text-base font-semibold text-foreground">
                      {item.title}
                    </h3>
                    {item.status === "in-progress" && (
                      <span className="rounded bg-primary px-1.5 py-0.5 font-mono text-[10px] font-semibold text-primary-foreground">
                        IN PROGRESS
                      </span>
                    )}
                    {item.status === "ahead" && (
                      <span className="font-mono text-[10px] text-muted-foreground">AHEAD</span>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">{item.body}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-10">
          <div className="rounded-xl border border-primary/40 bg-card p-6 glow-primary">
            <p className="font-mono text-[10px] tracking-[0.2em] text-primary">CURRENTLY EXPLORING</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Reinforcement Learning", "Autonomous Robotics", "AI-Assisted Engineering"].map(
                (t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-background px-3 py-1 font-mono text-xs text-foreground"
                  >
                    {t}
                  </span>
                ),
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Certifications() {
  return (
    <section id="certifications" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="CERTIFICATIONS"
            title={
              <>
                Recognition, Training & <span className="text-gradient">Competition</span>
              </>
            }
          />
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((item) => {
            const media = certificationMedia[item.key];
            return (
              <Reveal key={item.key}>
                <article className="card-lift group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
                  <div className="relative aspect-[4/3] overflow-hidden border-b border-border bg-background">
                    <img
                      src={media.thumb}
                      alt={`${item.award} — ${item.title}`}
                      width={media.width}
                      height={media.height}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-primary/50 bg-background/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-primary backdrop-blur">
                      <BadgeCheck size={12} aria-hidden="true" />
                      {item.award}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-base font-semibold leading-snug text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-primary">{item.issuer}</p>
                    {item.period && (
                      <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">
                        {item.period}
                      </p>
                    )}
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                    <a
                      href={media.full}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-auto inline-flex items-center gap-2 pt-5 font-mono text-xs text-primary transition-colors hover:underline"
                    >
                      {media.isPdf ? <FileText size={14} /> : <Award size={14} />}
                      View certificate
                    </a>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const display = (url: string) =>
    url
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/$/, "")
      .replace(/^linkedin\.com\//, "");

  const channels = [
    {
      label: "Email",
      value: identity.email,
      href: `mailto:${identity.email}`,
      Icon: Mail,
      external: false,
    },
    {
      label: "GitHub",
      value: display(identity.github),
      href: identity.github,
      Icon: Github,
      external: true,
    },
    {
      label: "LinkedIn",
      value: display(identity.linkedin),
      href: identity.linkedin,
      Icon: Linkedin,
      external: true,
    },
    {
      label: "YouTube",
      value: display(identity.youtube),
      href: identity.youtube,
      Icon: Youtube,
      external: true,
    },
  ];

  return (
    <section id="contact" className="relative border-t border-border bg-surface">
      <div className="absolute inset-0 bg-engineering-grid opacity-30" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="CONTACT"
            title="Interested in Web Development, Robotics, AI, or Engineering Research?"
          />
        </Reveal>
        <Reveal>
          <p className="mx-auto max-w-2xl text-center text-base leading-relaxed text-muted-foreground">
            I bring a background in web development and an expanding interest in intelligent
            engineering systems. I'm interested in connecting with developers, researchers,
            engineers, and collaborators working on web technologies, reinforcement learning,
            robotics, industrial AI, and related problems. Feel free to reach out to discuss a
            project or exchange ideas.
          </p>
        </Reveal>
        <Reveal>
          <h3 className="mt-14 text-center font-mono text-xs font-medium uppercase tracking-[0.35em] text-primary">
            Contact me
          </h3>
          <div className="mx-auto mt-6 grid max-w-3xl gap-4 sm:grid-cols-2">
            {channels.map(({ label, value, href, Icon, external }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="card-lift group flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-background text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-sm font-semibold text-foreground">
                    {label}
                  </span>
                  <span className="block truncate font-mono text-[11px] text-muted-foreground transition-colors duration-300 group-hover:text-primary">
                    {value}
                  </span>
                </span>
                <ArrowUpRight
                  size={16}
                  className="ml-auto shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                />
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-10 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-primary/50 bg-card font-display text-xs text-primary">
            {identity.monogram}
          </span>
          <span className="font-display text-sm font-semibold text-foreground">{identity.name}</span>
        </div>
        <p className="max-w-md text-center text-sm text-muted-foreground">
          Built with curiosity, software, engineering, and a passion for intelligent systems.
        </p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          <a href={identity.github} target="_blank" rel="noreferrer" aria-label="GitHub profile"
            className="text-muted-foreground transition-colors hover:text-primary">
            <Github size={18} />
          </a>
          <a href={identity.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn profile"
            className="text-muted-foreground transition-colors hover:text-primary">
            <Linkedin size={18} />
          </a>
          <a href={identity.youtube} target="_blank" rel="noreferrer" aria-label="YouTube channel"
            className="text-muted-foreground transition-colors hover:text-primary">
            <Youtube size={18} />
          </a>
        </div>
        <p className="font-mono text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} {identity.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let lenis: { raf: (t: number) => void; destroy: () => void; scrollTo: (t: Element, o?: object) => void } | null = null;
    let frame = 0;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]');
      const id = a?.getAttribute("href");
      if (!lenis || !id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -64, duration: 1.4 });
    };
    import("lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({ duration: 1.2, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
      const loop = (t: number) => {
        lenis?.raf(t);
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);
    });
    document.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onClick);
      lenis?.destroy();
    };
  }, []);
}

/* Sea-green brightness spotlight that follows the cursor */
function CursorGlow() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    let frame = 0;
    let x = -1;
    let y = -1;
    const apply = () => {
      frame = 0;
      if (x < 0) return;
      root.style.setProperty("--cursor-x", `${x}px`);
      root.style.setProperty("--cursor-y", `${y}px`);
    };
    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return <div aria-hidden="true" className="cursor-glow" />;
}

function Portfolio() {
  useSmoothScroll();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <CursorGlow />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Research />
        <Experience />
        <Certifications />
        <Journey />
        <Contact />
      </main>
      <Footer />
      <CircuitBoard className="hidden" aria-hidden="true" />
      <Network className="hidden" aria-hidden="true" />
    </div>
  );
}
