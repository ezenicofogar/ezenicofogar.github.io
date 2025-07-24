document.addEventListener("DOMContentLoaded", () => {
    for (const e of document.getElementsByClassName("gsap-slide-in-from-left")) {
        gsap.from(e, {
            opacity: 0,
            x: -250,
            ease: "back.out(1.7)",
            duration: 0.800,
            delay: 0.1,
            scrollTrigger: {
                trigger: e,
                start: "top bottom",
                // markers: true,
                toggleActions: "play reset play reset"
            }
        })
    }
    for (const e of document.getElementsByClassName("gsap-fade-in")) {
        gsap.from(e, {
            opacity: 0,
            ease: "power1.out",
            duration: 1.300,
            delay: 0.2,
            scrollTrigger: {
                trigger: e,
                start: "top bottom",
                // markers: true,
                toggleActions: "play reset play reset"
            }
        })
    }
    for (const e of document.getElementsByClassName("gsap-img-parallax")) {
        gsap.fromTo(e, {
            objectPosition: "50% 100%",
        }, {
            objectPosition: "50% 0%",
            ease: "none",
            scrollTrigger: {
                trigger: e,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                // markers: true,
            }
        })
    }
});