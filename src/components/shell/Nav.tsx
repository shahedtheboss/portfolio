import { useEffect, useRef, useState } from "react";
import { LayoutGroup, motion } from "motion/react";
import { Menu } from "lucide-react";

import { identity } from "@/data/portfolio";
import { useActiveSection } from "@/hooks/useActiveSection";
import { navItems } from "@/lib/media";
import { cn } from "@/lib/utils";

import { MobileMenu } from "./MobileMenu";
import { ProjectsDropdown } from "./ProjectsDropdown";
import { ScrollProgress } from "./ScrollProgress";
import { ThemeToggle } from "./ThemeToggle";

const linkClass =
  "relative inline-flex items-center px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-primary data-[active=true]:text-foreground";

/** Floating HUD bar: full at top, condensed after scrolling. */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const active = useActiveSection();
  const menuBtn = useRef<HTMLButtonElement>(null);
  const activeLabel = navItems.find((n) => n.id === active)?.label ?? "Home";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => {
    setMenu(false);
    menuBtn.current?.focus();
  };

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:px-6">
        <nav
          aria-label="Main"
          className={cn(
            "pointer-events-auto relative flex h-12 items-center justify-between gap-3 border border-border bg-background/70 px-3 backdrop-blur-md transition-[max-width] duration-500 ease-[var(--ease-out-expo)]",
            "w-full",
            scrolled ? "max-w-[34rem]" : "max-w-[1400px]",
          )}
        >
          <a href="#home" className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-7 w-9 shrink-0 items-center justify-center border border-primary font-mono text-[10px] text-primary">
              {identity.monogram}
            </span>
            <span
              className={cn(
                "display-type truncate text-xs text-foreground [font-stretch:110%]",
                scrolled && "hidden sm:inline",
                !scrolled && "hidden min-[420px]:inline",
              )}
            >
              {identity.name}
            </span>
          </a>

          {scrolled ? (
            <span
              aria-hidden="true"
              className="telemetry hidden min-w-0 flex-1 truncate text-center text-primary sm:block"
            >
              {activeLabel}
            </span>
          ) : (
            <LayoutGroup>
              <ul className="hidden items-center lg:flex">
                {navItems.map((item) => {
                  const isActive = item.id === active;
                  const inner = (
                    <>
                      {item.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          aria-hidden="true"
                          className="absolute inset-x-3 -bottom-[7px] h-px bg-primary"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                    </>
                  );
                  return item.id === "projects" ? (
                    <ProjectsDropdown key={item.id} active={isActive} linkClass={linkClass} />
                  ) : (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        data-active={isActive}
                        aria-current={isActive ? "true" : undefined}
                        className={linkClass}
                      >
                        {inner}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </LayoutGroup>
          )}

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {!scrolled && (
              <a
                href="#projects"
                className="hidden whitespace-nowrap border border-primary bg-primary px-3 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-primary-foreground transition-opacity hover:opacity-90 sm:inline-flex lg:hidden xl:inline-flex"
              >
                Explore Projects
              </a>
            )}
            <button
              ref={menuBtn}
              type="button"
              onClick={() => setMenu(true)}
              aria-label="Open menu"
              aria-expanded={menu}
              aria-haspopup="dialog"
              className={cn(
                "h-9 w-9 items-center justify-center border border-border text-foreground transition-colors hover:border-primary hover:text-primary",
                scrolled ? "flex" : "flex lg:hidden",
              )}
            >
              <Menu size={18} />
            </button>
          </div>
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-border">
            <ScrollProgress className="block h-px bg-primary" />
          </span>
        </nav>
      </header>
      <MobileMenu open={menu} onClose={closeMenu} />
    </>
  );
}
