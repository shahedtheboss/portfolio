/** Decorative survey-map details behind the route. */
export function MapDecor() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle,var(--n-2)_1px,transparent_1.5px)] bg-[length:32px_32px] opacity-40 [mask-image:linear-gradient(to_bottom,transparent,#000_8%,#000_92%,transparent)]" />
      <div className="absolute inset-y-0 right-0 hidden w-2 bg-[repeating-linear-gradient(to_bottom,var(--n-3)_0_1px,transparent_1px_24px)] opacity-60 md:block" />
      <div className="absolute inset-y-0 left-0 hidden w-2 bg-[repeating-linear-gradient(to_bottom,var(--n-3)_0_1px,transparent_1px_24px)] opacity-60 md:block" />
      <svg
        className="absolute right-4 top-0 h-14 w-14 text-n-3 md:right-10"
        viewBox="0 0 56 56"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
      >
        <circle cx={28} cy={28} r={20} />
        <circle cx={28} cy={28} r={3} />
        <path d="M28 2v14M28 40v14M2 28h14M40 28h14" />
        <path d="M28 8l4 10h-8z" fill="currentColor" />
      </svg>
      <svg
        className="absolute bottom-2 left-4 h-4 w-28 text-n-3 md:left-10"
        viewBox="0 0 112 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
      >
        <path d="M1 12h110M1 4v8M29 8v4M56 8v4M84 8v4M111 4v8" />
      </svg>
    </div>
  );
}
