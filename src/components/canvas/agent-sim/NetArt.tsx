import { ARROWS, BUS_X, EDGES, NODES, PORT } from "./net-layout";

const hair = "fill-none stroke-n-4 [vector-effect:non-scaling-stroke]";
const hairLit = "fill-none stroke-primary [vector-effect:non-scaling-stroke]";

/** Policy net: nodes, edges, output bus. Animated by RobotNet through data-* hooks. */
export function NetArt() {
  const outs = NODES[3] ?? [];
  return (
    <g>
      <text
        x={34}
        y={62}
        className="fill-n-4 font-mono text-[12px] tracking-[0.18em] max-md:hidden"
      >
        POLICY NET
      </text>
      {EDGES.map((e, k) => (
        <line
          key={k}
          x1={e.a.x}
          y1={e.a.y}
          x2={e.b.x}
          y2={e.b.y}
          className="stroke-n-2 [vector-effect:non-scaling-stroke]"
          strokeOpacity={0.7}
        />
      ))}
      {NODES.map((layer, l) =>
        layer.map((p, i) =>
          l === 3 ? (
            <g key={`${l}-${i}`}>
              <rect x={p.x - 11} y={p.y - 11} width={22} height={22} className={hair} />
              <rect
                data-n={`${l}-${i}`}
                x={p.x - 11}
                y={p.y - 11}
                width={22}
                height={22}
                className="fill-primary"
                fillOpacity={0.25}
                opacity={0.12}
              />
              <text
                x={p.x}
                y={p.y + 4}
                textAnchor="middle"
                className="fill-n-5 font-mono text-[11px]"
              >
                {ARROWS[i]}
              </text>
            </g>
          ) : (
            <g key={`${l}-${i}`}>
              <circle
                cx={p.x}
                cy={p.y}
                r={5}
                className="fill-background stroke-n-4 [vector-effect:non-scaling-stroke]"
              />
              <circle
                data-n={`${l}-${i}`}
                cx={p.x}
                cy={p.y}
                r={2.2}
                className="fill-primary"
                opacity={0.12}
              />
            </g>
          ),
        ),
      )}
      <text
        x={214}
        y={outs[3] ? outs[3].y + 30 : 340}
        textAnchor="middle"
        className="fill-n-4 font-mono text-[12px] tracking-[0.18em] max-md:hidden"
      >
        ACTION
      </text>
      {Array.from({ length: 14 }, (_, i) => (
        <circle key={i} data-pulse r={2.4} className="fill-primary" opacity={0} />
      ))}
      {/* output bus and cable into the chest */}
      {outs.map((p, i) => (
        <line
          key={i}
          x1={p.x + 11}
          y1={p.y}
          x2={BUS_X}
          y2={p.y}
          className={hair}
          strokeOpacity={0.6}
        />
      ))}
      <line x1={BUS_X} y1={outs[0]?.y ?? 120} x2={BUS_X} y2={outs[3]?.y ?? 280} className={hair} />
      <polyline
        points={`${BUS_X},200 290,200 290,${PORT.y} ${PORT.x},${PORT.y}`}
        className={hairLit}
        strokeOpacity={0.7}
      />
      <circle data-id="cable-pulse" r={3} className="fill-primary" opacity={0} />
    </g>
  );
}
