/**
 * Runs before first paint (via next/script beforeInteractive in the root layout) so
 * scroll-reveal content does not flash. If RevealObserver has not started within
 * 3 seconds (e.g. JavaScript failed, or a page without it), the hidden states are
 * dropped and everything simply shows.
 */
const READY_CLASS = JSON.stringify("reveal-ready"); // a quoted JS string literal

export const REVEAL_BOOT_SCRIPT =
  `document.documentElement.classList.add(${READY_CLASS});` +
  `setTimeout(function(){if(!window.__revealMounted)document.documentElement.classList.remove(${READY_CLASS})},3000);`;
