/** JS mirror of the CSS motion tokens in styles.css. */
export const ease = {
  outExpo: [0.16, 1, 0.3, 1],
  inOutQuart: [0.76, 0, 0.24, 1],
  snap: [0.2, 0.9, 0.1, 1],
} as const;

/** Durations in seconds (CSS tokens are ms). */
export const dur = { d1: 0.16, d2: 0.32, d3: 0.64, d4: 1.1 } as const;

export const stagger = 0.06;

export const spring = { type: "spring", stiffness: 260, damping: 26, mass: 0.9 } as const;
