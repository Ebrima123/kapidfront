"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __revealMounted?: boolean;
  }
}

const EASE_OUT = "cubic-bezier(0.2, 0.7, 0.2, 1)";
// A roller pass: eases in and out like a steady arm movement.
const EASE_ROLLER = "cubic-bezier(0.65, 0, 0.35, 1)";

/** Read a CSS time custom property such as --reveal-delay: 180ms. */
function msVar(el: Element, name: string) {
  const v = getComputedStyle(el).getPropertyValue(name).trim();
  return v ? parseFloat(v) * (v.endsWith("ms") ? 1 : 1000) : 0;
}

/**
 * Play one element's painting animation. Uses the Web Animations API with
 * fill: "forwards" so nothing in the DOM React manages is changed (changing
 * attributes before a streamed section hydrates causes hydration mismatches).
 */
const played = new WeakSet<Element>();

function play(el: Element, parentDelay = 0) {
  if (played.has(el)) return;
  played.add(el);
  const delay = parentDelay + msVar(el, "--reveal-delay");
  const opts = (duration: number, extraDelay = 0, easing = EASE_OUT): KeyframeAnimationOptions => ({
    duration,
    delay: delay + extraDelay,
    easing,
    fill: "forwards",
  });

  switch ((el as HTMLElement).dataset.reveal) {
    case "rise":
      el.animate([{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }], opts(800));
      break;
    case "wipe":
      el.animate([{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }], opts(1100, 0, EASE_ROLLER));
      break;
    case "drop":
      [...el.children].forEach((child, i) =>
        child.animate([{ transform: "translateY(-104%)" }, { transform: "none" }], opts(900, i * 90, "cubic-bezier(0.2, 0.8, 0.2, 1)")),
      );
      break;
    case "roller": {
      // A roller rolls across and paints the band; band edge and roller share one easing so
      // the wet edge stays under the sleeve. The content appears once the wall is painted.
      const band = el.querySelector(".roller-band");
      const tool = el.querySelector<HTMLElement>(".paint-roller-tool");
      const content = el.querySelector("figure");
      const width = el.getBoundingClientRect().width;
      const toolWidth = tool?.offsetWidth ?? 72;
      const ROLL = 1700;
      const ease = "cubic-bezier(0.45, 0, 0.4, 1)";
      band?.animate([{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }], {
        duration: ROLL,
        delay,
        easing: ease,
        fill: "forwards",
      });
      tool?.animate(
        [{ transform: `translateX(${-toolWidth / 2}px)` }, { transform: `translateX(${width - toolWidth / 2}px)` }],
        { duration: ROLL, delay, easing: ease, fill: "forwards" },
      );
      tool?.animate(
        [{ opacity: 0 }, { opacity: 1, offset: 0.06 }, { opacity: 1, offset: 0.9 }, { opacity: 0 }],
        { duration: ROLL + 200, delay, fill: "forwards" },
      );
      content?.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], opts(700, ROLL - 300));
      break;
    }
    case "drips":
      [...el.children].forEach((child) =>
        child.animate(
          [{ transform: "scaleY(0)" }, { transform: "scaleY(1.06)", offset: 0.7 }, { transform: "scaleY(1)" }],
          opts(1600, msVar(child, "--drip-delay"), "cubic-bezier(0.3, 0.6, 0.3, 1)"),
        ),
      );
      break;
  }

  // Nested reveals (e.g. the hero swatches inside the wiping panel) start with their
  // parent: while the parent is clipped, the browser may never report them as visible.
  if ((el as HTMLElement).dataset.reveal !== "roller") {
    el.querySelectorAll("[data-reveal]").forEach((child) => play(child, delay + 250));
  }
}

/**
 * Plays the painting animations as [data-reveal] elements scroll into view (once
 * each), including elements that stream in after the first paint.
 */
export function RevealObserver() {
  useEffect(() => {
    window.__revealMounted = true;
    // Development aid: lets tooling trigger a reveal where scroll events can't fire.
    if (process.env.NODE_ENV !== "production") (window as unknown as { __kapidReveal: typeof play }).__kapidReveal = play;
    // Reduced motion: the CSS never hides anything, so there is nothing to play.
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // The boot script hides content before first paint. If it didn't run, or gave up
    // after its timeout, the page is already showing everything: hiding it now would
    // make visible content (like the hero image) vanish, so skip the animations.
    if (!document.documentElement.classList.contains("reveal-ready")) return;

    const seen = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.unobserve(entry.target);
          play(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    const observe = (el: Element) => {
      if (seen.has(el) || played.has(el)) return;
      seen.add(el);
      // Added inside an already-played reveal (e.g. a fallback image swap): play right away.
      const parent = el.parentElement?.closest("[data-reveal]");
      if (parent && played.has(parent)) return play(el);
      io.observe(el);
    };
    const scan = (scope: ParentNode) => scope.querySelectorAll?.("[data-reveal]").forEach(observe);
    scan(document);

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations)
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches("[data-reveal]")) observe(node);
          scan(node);
        });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}

