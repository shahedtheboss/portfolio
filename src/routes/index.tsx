import { createFileRoute } from "@tanstack/react-router";

import portraitAsset from "@/assets/portrait.jpg.asset.json";
import { About } from "@/components/sections/About";
import { Certifications } from "@/components/sections/Certifications";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Journey } from "@/components/sections/Journey";
import { Projects } from "@/components/sections/Projects";
import { Research } from "@/components/sections/Research";
import { Skills } from "@/components/sections/Skills";
import { BootLoader } from "@/components/shell/BootLoader";
import { Cursor } from "@/components/shell/Cursor";
import { Footer } from "@/components/shell/Footer";
import { Grain } from "@/components/shell/Grain";
import { Nav } from "@/components/shell/Nav";
import { SideRail } from "@/components/shell/SideRail";
import { useLenis } from "@/hooks/useLenis";

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
      {
        name: "twitter:image",
        content: `https://shahdath-hussain.lovable.app${portraitAsset.url}`,
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://shahdath-hussain.lovable.app/" }],
  }),
  component: Portfolio,
});

function Portfolio() {
  useLenis();
  return (
    <div className="isolate min-h-screen bg-background text-foreground">
      <Grain />
      <Cursor />
      <BootLoader />
      <Nav />
      <SideRail />
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
    </div>
  );
}
