import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Global Lenis instance — null when reduced motion is requested or before init. */
let lenisInstance: Lenis | null = null;

/** Smooth-scrolls to a selector. Uses Lenis when active so native
 *  `scrollIntoView({ behavior: "smooth" })` never fights the Lenis raf loop. */
export function scrollTo(selector: string) {
  const target = document.querySelector(selector);
  if (!target) return;

  if (lenisInstance) {
    lenisInstance.scrollTo(target as HTMLElement, { offset: 0, duration: 1.2 });
  } else {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/** Enables Lenis-powered scrolling unless the user requests reduced motion. */
export function useSmoothScroll() {
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    lenisInstance = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
}
