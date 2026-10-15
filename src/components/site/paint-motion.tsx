"use client";

import { useEffect, useRef } from "react";

/**
 * Explicit painting animations. Decorative only (aria-hidden). Both show the finished
 * result for people who prefer reduced motion or when JavaScript is unavailable.
 */

// One path drives both the paint and the brush, so the bristles stay on the wet edge.
const STROKE = "M18 44C110 30 230 24 340 27s200 9 242 6";
const DURATION = 1.5; // seconds
const SPLINE = "0.65 0 0.35 1"; // ease-in-out, like a steady arm movement
// No hyphens: SMIL timing reads "-" in "id.begin" as a minus offset, so the link would never fire.
const START = "kpBrushStart";

const draw = {
  attributeName: "stroke-dashoffset",
  values: "1;0",
  begin: `${START}.begin`,
  dur: `${DURATION}s`,
  fill: "freeze" as const,
  calcMode: "spline" as const,
  keyTimes: "0;1",
  keySplines: SPLINE,
};

/** A paintbrush sweeps under the headline, laying down a rust stroke, then lifts away. */
export function BrushPaint({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Reduced motion: CSS shows the finished stroke and hides the brush; nothing to play.
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = ref.current?.querySelector<SVGAnimationElement>(`#${START}`);
    start?.beginElementAt(0.35);
  }, []);

  return (
    <svg ref={ref} viewBox="0 0 600 70" className={`brush-paint overflow-visible ${className}`} fill="none" aria-hidden>
      {/* The paint: a thick stroke plus bristle streaks. Starts undrawn (dashoffset 1);
          globals.css reveals it outright when motion is reduced or JS hasn't run. */}
      <g className="brush-paint-stroke text-accent-600" stroke="currentColor" strokeLinecap="round">
        <path pathLength={1} strokeDasharray="1" strokeDashoffset="1" d={STROKE} strokeWidth="13">
          <animate {...draw} />
        </path>
        <path
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset="1"
          d="M30 52C140 40 250 36 350 38s170 6 210 4"
          strokeWidth="3"
          strokeOpacity="0.55"
        >
          <animate {...draw} />
        </path>
        <path
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset="1"
          d="M40 36C150 24 260 20 360 22s160 5 200 3"
          strokeWidth="2"
          strokeOpacity="0.4"
        >
          <animate {...draw} />
        </path>
      </g>

      {/* The brush, bristle tip at the origin, leaning back from the direction of travel */}
      <g className="brush-paint-tool" opacity="0">
        <g transform="rotate(-32)">
          <path d="M-8 -6h16v4c0 5-3 9-8 10-5-1-8-5-8-10z" fill="#b8501f" />
          <path d="M-8 -6h16" stroke="#8e3d16" strokeWidth="1.5" />
          <rect x="-9" y="-22" width="18" height="16" rx="2" fill="#c7ccd4" />
          <rect x="-9" y="-17" width="18" height="2.5" fill="#a5acb6" />
          <rect x="-5" y="-70" width="10" height="49" rx="5" fill="#122338" />
        </g>
        <set id={START} attributeName="opacity" to="1" begin="indefinite" fill="freeze" />
        <animateMotion
          path={STROKE}
          begin={`${START}.begin`}
          dur={`${DURATION}s`}
          fill="freeze"
          calcMode="spline"
          keyPoints="0;1"
          keyTimes="0;1"
          keySplines={SPLINE}
        />
        {/* Lift the brush up and away once the stroke is finished */}
        <animate attributeName="opacity" values="1;0" begin={`${START}.begin+${DURATION}s`} dur="0.45s" fill="freeze" />
        <animateTransform
          attributeName="transform"
          type="translate"
          additive="sum"
          values="0 0;14 -26"
          begin={`${START}.begin+${DURATION}s`}
          dur="0.45s"
          fill="freeze"
        />
      </g>
    </svg>
  );
}

/** A paint roller, drawn upright, for the motto band. */
export function PaintRoller({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 200" preserveAspectRatio="xMidYMid meet" className={className} aria-hidden>
      {/* Frame and handle */}
      <path d="M44 14h8v86" stroke="#122338" strokeWidth="5" fill="none" strokeLinejoin="round" />
      <rect x="47" y="96" width="10" height="100" rx="5" fill="#122338" />
      {/* Roller sleeve loaded with paint */}
      <rect x="6" y="4" width="34" height="140" rx="12" fill="#e6dccb" stroke="#cbb89c" strokeWidth="2" />
      <path d="M14 14v120M23 10v128M32 14v120" stroke="#cbb89c" strokeWidth="1.5" strokeOpacity="0.7" />
      <rect x="38" y="10" width="8" height="128" rx="3" fill="#a5acb6" />
    </svg>
  );
}
