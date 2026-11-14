import { cn } from "@/lib/utils";

import { L1, L2, SHOULDER } from "./net-layout";

const hair = "fill-none stroke-n-4 [vector-effect:non-scaling-stroke]";
const hairLit = "fill-none stroke-primary [vector-effect:non-scaling-stroke]";

/** Line-art robot. Animated by RobotNet through data-id hooks. */
export function RobotArt() {
  return (
    <g data-id="body">
      <line x1={380} y1={90} x2={380} y2={62} className={hair} />
      <circle data-id="tip" cx={380} cy={57} r={4.5} className="fill-secondary" />
      <circle
        cx={380}
        cy={57}
        r={9}
        className="fill-none stroke-secondary [vector-effect:non-scaling-stroke]"
        strokeOpacity={0.4}
      />
      <rect x={338} y={90} width={84} height={64} rx={6} className={cn(hair, "stroke-n-5")} />
      <rect x={350} y={104} width={60} height={28} rx={14} className={hair} />
      <circle data-id="eye" cx={380} cy={118} r={7} className="fill-primary" />
      <circle
        cx={380}
        cy={118}
        r={12}
        className="fill-none stroke-primary [vector-effect:non-scaling-stroke]"
        strokeOpacity={0.25}
      />
      <line x1={346} y1={144} x2={366} y2={144} className={hair} />
      <line x1={394} y1={144} x2={414} y2={144} className={hair} />
      <path d="M368 154 V168 M392 154 V168" className={hair} />
      <rect x={330} y={168} width={100} height={116} rx={4} className={cn(hair, "stroke-n-5")} />
      <rect x={344} y={182} width={72} height={46} className={hair} />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          data-bar
          x={350}
          y={190 + i * 12}
          width={20}
          height={4}
          className="fill-primary"
          opacity={0.8 - i * 0.2}
        />
      ))}
      <circle cx={406} cy={191} r={2.5} className="fill-primary" />
      <path d="M344 252 H416 M344 262 H400 M344 272 H388" className={hair} strokeOpacity={0.5} />
      <path d="M312 284 H448 L460 306 H300 Z" className={hair} />
      {/* left arm at rest */}
      <path d="M330 196 L304 226 L308 262" className={hair} />
      <circle cx={304} cy={226} r={4} className={hair} />
      {/* articulated right arm */}
      <line
        data-id="upper"
        x1={SHOULDER.x}
        y1={SHOULDER.y}
        x2={SHOULDER.x + L1}
        y2={SHOULDER.y}
        className={cn(hair, "stroke-n-5")}
        strokeWidth={1.5}
      />
      <line
        data-id="fore"
        x1={SHOULDER.x + L1}
        y1={SHOULDER.y}
        x2={SHOULDER.x + L1 + L2}
        y2={SHOULDER.y}
        className={cn(hair, "stroke-n-5")}
        strokeWidth={1.5}
      />
      <circle
        data-id="j-shoulder"
        cx={SHOULDER.x}
        cy={SHOULDER.y}
        r={5}
        className="fill-background stroke-primary [vector-effect:non-scaling-stroke]"
      />
      <circle
        data-id="j-elbow"
        cx={SHOULDER.x + L1}
        cy={SHOULDER.y}
        r={4}
        className="fill-background stroke-primary [vector-effect:non-scaling-stroke]"
      />
      <circle
        data-id="j-wrist"
        cx={SHOULDER.x + L1 + L2}
        cy={SHOULDER.y}
        r={3}
        className="fill-primary"
      />
      <polyline data-id="claw" points="0,0 0,0 0,0" className={hairLit} />
    </g>
  );
}
