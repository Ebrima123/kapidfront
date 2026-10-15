/**
 * Runs before first paint (via next/script beforeInteractive in the root layout) so
 * scroll-reveal content does not flash. If RevealObserver has not started within
 * 3 seconds (e.g. JavaScript failed, or a page without it), the hidden states are
 * dropped and everything simply shows.
 */
export const REVEAL_BOOT_SCRIPT = `document.documentElement.classList.add(reveal-ready);setTimeout(function(){if(!window.__revealMounted)document.documentElement.classList.remove(reveal-ready)},3000);`;
