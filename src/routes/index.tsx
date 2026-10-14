import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  Brain,
  CircuitBoard,
  Cpu,
  Eye,
  Factory,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  Menu,
  Network,
  ScanLine,
  X,
} from "lucide-react";

import heroVisual from "@/assets/hero-visual.jpg";
import projectRobot from "@/assets/project-robot.jpg";
import projectVision from "@/assets/project-vision.jpg";
import projectAutomation from "@/assets/project-automation.jpg";
import projectMl from "@/assets/project-ml.jpg";
import projectWeb from "@/assets/project-web.jpg";

import {
  aboutThemes,
  education,
  experience,
  identity,
  identityCard,
  journey,
  projectFilters,
  projects,
  researchInterests,
  skillGroups,
  type Project,
} from "@/data/portfolio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shahadat Hussain Shahed | Web Development, AI & Robotics" },
      {
        name: "description",
        content:
          "Portfolio of Shahadat Hussain Shahed — EEE undergraduate at CUET and web developer with 6 years of experience, expanding into AI, reinforcement learning, robotics, and intelligent control systems.",
      },
      { property: "og:title", content: "Shahadat Hussain Shahed | Web Development, AI & Robotics" },
      {
        property: "og:description",
        content:
          "From building for the web to building intelligent systems — EEE student at CUET exploring AI, robotics, and reinforcement learning.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Portfolio,
});

const projectImages: Record<Project["image"], string> = {
  robot: projectRobot,
  vision: projectVision,
  automation: projectAutomation,
  ml: projectMl,
  web: projectWeb,
};

const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "research", label: "Research" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
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
        <a href="#home" className="flex items-center gap-2 font-mono text-sm font-semibold text-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-primary/50 bg-card font-display text-xs text-primary glow-primary">
            {identity.monogram}
          </span>
          <span className="hidden sm:inline">{identity.name}</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </a>
            </li>
          ))}
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
        <div>
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
          </div>

          <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 font-mono text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse-dot" aria-hidden="true" />
            {identity.status}
          </p>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl border border-primary/40 glow-primary">
            <img
              src={heroVisual}
              alt="Abstract visualization of a human figure formed from neural-network nodes and circuit traces, representing the fusion of software and intelligent systems"
              width={1024}
              height={1280}
              className="h-auto w-full object-cover"
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
          <SectionHeading eyebrow="ABOUT ME" title="A developer's foundation, an engineer's direction" />
        </Reveal>
        <div className="grid gap-10 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                I'm an Electrical and Electronic Engineering student at CUET with approximately six
                years of experience in web development. My journey through web development has given
                me a sustained interest in programming, building digital experiences, and solving
                practical software problems.
              </p>
              <p>
                I'm now expanding that foundation into machine learning, PyTorch, reinforcement
                learning, robotics, and industrial automation. What interests me most is the
                opportunity to combine software development with electrical engineering to build
                systems that can perceive their surroundings, learn from experience, make decisions,
                and interact with the physical world.
              </p>
              <p>
                My long-term goal is to develop deeper expertise in intelligent systems and
                contribute to meaningful engineering projects and research — bringing together my
                software-development background and my growing understanding of AI and robotics.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-1">
            {aboutThemes.map((theme) => (
              <Reveal key={theme.title}>
                <div className="card-lift rounded-xl border border-border bg-card p-5">
                  <h3 className="font-display text-sm font-semibold text-primary">{theme.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{theme.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
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

function Projects() {
  const [filter, setFilter] = useState<string>("all");
  const visible = projects.filter((p) => filter === "all" || p.category === filter);

  return (
    <section id="projects" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="FEATURED PROJECTS" title="Work in progress, work in production" />
        </Reveal>

        <div className="mb-10 flex flex-wrap gap-2" role="group" aria-label="Filter projects">
          {projectFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
              className={`rounded-full border px-4 py-1.5 font-mono text-xs transition-colors ${
                filter === f.key
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {visible.map((project) => (
            <Reveal key={project.title}>
              <article className="card-lift group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
                <div className="relative overflow-hidden">
                  <img
                    src={projectImages[project.image]}
                    alt={`Illustration for ${project.title}`}
                    loading="lazy"
                    width={1200}
                    height={800}
                    className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <span
                    className={`absolute left-4 top-4 rounded-full border px-3 py-1 font-mono text-[10px] tracking-wider backdrop-blur ${
                      project.status === "Completed"
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
                    {project.title}
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
                </div>
              </article>
            </Reveal>
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
          {journey.map((item, i) => (
            <Reveal key={item.step}>
              <li className="relative">
                <span
                  className={`absolute -left-[31px] top-1 h-2.5 w-2.5 rounded-full border ${
                    i < 6
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
                    {i >= 6 && (
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

function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = encodeURIComponent(String(data.get("subject") || "Portfolio contact"));
    const body = encodeURIComponent(
      `Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`,
    );
    window.location.href = `mailto:${identity.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

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
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
              I bring a background in web development and an expanding interest in intelligent
              engineering systems. I'm interested in connecting with developers, researchers,
              engineers, and collaborators working on web technologies, reinforcement learning,
              robotics, industrial AI, and related problems. Feel free to reach out to discuss a
              project or exchange ideas.
            </p>
            <div className="mt-8 space-y-3">
              <a
                href={`mailto:${identity.email}`}
                className="flex items-center gap-3 text-sm text-foreground transition-colors hover:text-primary"
              >
                <Mail size={16} className="text-primary" /> {identity.email}
              </a>
              <a
                href={identity.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-sm text-foreground transition-colors hover:text-primary"
              >
                <Github size={16} className="text-primary" /> GitHub
              </a>
              <a
                href={identity.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-sm text-foreground transition-colors hover:text-primary"
              >
                <Linkedin size={16} className="text-primary" /> LinkedIn
              </a>
            </div>
          </Reveal>

          <Reveal>
            <form
              onSubmit={handleSubmit}
              className="rounded-xl border border-border bg-card p-6"
              aria-label="Contact form"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1.5 block font-mono text-xs text-muted-foreground">Name</span>
                  <input
                    required
                    name="name"
                    type="text"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                    placeholder="Your name"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1.5 block font-mono text-xs text-muted-foreground">Email</span>
                  <input
                    required
                    name="email"
                    type="email"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                    placeholder="you@example.com"
                  />
                </label>
              </div>
              <label className="mt-4 block text-sm">
                <span className="mb-1.5 block font-mono text-xs text-muted-foreground">Subject</span>
                <input
                  required
                  name="subject"
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                  placeholder="What's this about?"
                />
              </label>
              <label className="mt-4 block text-sm">
                <span className="mb-1.5 block font-mono text-xs text-muted-foreground">Message</span>
                <textarea
                  required
                  name="message"
                  rows={5}
                  className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                  placeholder="Your message…"
                />
              </label>
              <button
                type="submit"
                className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Send Message <ArrowRight size={16} />
              </button>
              {sent && (
                <p className="mt-3 font-mono text-xs text-primary" role="status">
                  Opening your email client with the message pre-filled.
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
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
        </div>
        <p className="font-mono text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} {identity.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function Portfolio() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <About />
        <Research />
        <Skills />
        <Projects />
        <Experience />
        <Journey />
        <Contact />
      </main>
      <Footer />
      <CircuitBoard className="hidden" aria-hidden="true" />
      <Network className="hidden" aria-hidden="true" />
    </div>
  );
}
