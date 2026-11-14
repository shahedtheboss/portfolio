export const intro =
  "I'm naturally curious, enjoy solving challenging problems, and believe in learning through experimentation. I like understanding the logic behind things, testing ideas, and continuously improving through practice.";

export const feeds = [
  {
    label: "My mindset —",
    body: "Analytical, hands-on, and always learning. I value creative problem-solving, strategic thinking, and sharing knowledge with others.",
  },
  {
    label: "Beyond technology —",
    body: "I'm passionate about competitive gaming, where strategy and quick decisions matter, and adventure, which gives me opportunities to explore, embrace challenges, and step outside my comfort zone.",
  },
  {
    label: "What drives me —",
    body: "The satisfaction of overcoming difficult challenges, discovering something new, and turning ideas into something meaningful.",
  },
] as const;

/** Scroll windows (0..1 of the pinned track) in which feed 1 and 2 wipe in. */
export const WIPES: readonly (readonly [number, number])[] = [
  [0, 0.001],
  [0.3, 0.38],
  [0.63, 0.71],
];

/** Windows in which each feed's line drawing completes. */
export const DRAWS: readonly (readonly [number, number])[] = [
  [0, 0.2],
  [0.34, 0.52],
  [0.67, 0.88],
];

export function activeFeed(p: number) {
  return p < 0.34 ? 0 : p < 0.67 ? 1 : 2;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Decorative timecode HH:MM:SS:FF derived from scroll progress (2 minutes at 30fps). */
export function formatTimecode(p: number) {
  const frames = Math.round(Math.min(Math.max(p, 0), 1) * 120 * 30);
  const ff = frames % 30;
  const s = Math.floor(frames / 30);
  return `00:${pad(Math.floor(s / 60))}:${pad(s % 60)}:${pad(ff)}`;
}

export const camLabel = (i: number) => `CAM ${pad(i + 1)}`;
