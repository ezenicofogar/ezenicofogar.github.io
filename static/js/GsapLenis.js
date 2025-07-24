// Register gsap plugins
gsap.registerPlugin(ScrollTrigger)

function easer(x) {
  // return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  return 1 - Math.pow(1 - x, 3);
}

// Initialize Lenis instance
const lenis = new Lenis({
  "duration": 1.4,
  "easing": easer,
  "wheelMultiplier": 1.5,
  "touchMultiplier": 1,
});

// Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
lenis.on('scroll', ScrollTrigger.update);

// Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
// This ensures Lenis's smooth scroll animation updates on each GSAP tick
gsap.ticker.add((time) => {
  lenis.raf(time * 1000); // Convert time from seconds to milliseconds
});

// Disable lag smoothing in GSAP to prevent any delay in scroll animations
gsap.ticker.lagSmoothing(0);
