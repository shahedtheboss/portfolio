import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

const btn =
  "inline-flex items-center justify-center border px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-[0.14em] transition-colors";

function SignalShell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="blueprint-grid relative flex min-h-screen items-center justify-center bg-background px-4">
      <div className="relative w-full max-w-md border border-border bg-card p-8">
        <p aria-hidden="true" className="telemetry text-secondary">
          {label}
        </p>
        {children}
      </div>
    </div>
  );
}

function NotFoundComponent() {
  return (
    <SignalShell label="SIGNAL LOST">
      <h1 className="display-type mt-4 text-7xl text-foreground">404</h1>
      <h2 className="mt-4 font-display text-xl font-semibold text-foreground">Page not found</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-6">
        <Link
          to="/"
          className={`${btn} border-primary bg-primary text-primary-foreground hover:opacity-90`}
        >
          Go home
        </Link>
      </div>
    </SignalShell>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <SignalShell label="SIGNAL LOST">
      <h1 className="display-type mt-4 text-2xl text-foreground">This page didn't load</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Something went wrong on our end. You can try refreshing or head back home.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className={`${btn} border-primary bg-primary text-primary-foreground hover:opacity-90`}
        >
          Try again
        </button>
        <a
          href="/"
          className={`${btn} border-n-2 text-foreground hover:border-primary hover:text-primary`}
        >
          Go home
        </a>
      </div>
    </SignalShell>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Md. Shahdath Hussain | Web Development, AI & Robotics" },
      {
        name: "description",
        content:
          "Portfolio of Md. Shahdath Hussain — EEE undergraduate at CUET and web developer expanding into AI, robotics, and reinforcement learning.",
      },
      { name: "author", content: "Md. Shahdath Hussain" },
      { property: "og:title", content: "Md. Shahdath Hussain | Web Development, AI & Robotics" },
      {
        property: "og:description",
        content:
          "From building for the web to building intelligent systems — EEE student at CUET exploring AI, robotics, and reinforcement learning.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Hanken+Grotesk:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap",
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("theme")==="light")document.documentElement.classList.remove("dark")}catch(e){}`,
          }}
        />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
