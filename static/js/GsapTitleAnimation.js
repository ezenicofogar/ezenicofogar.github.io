// Animation
const ax = [
    {x:  0.93 * 2, y: -0.37 * 2},
    {x: -0.14 * 2, y:  0.99 * 2},
    {x: -0.79 * 2, y: -0.62 * 2}
];
document.addEventListener("DOMContentLoaded", ()=>{
    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#title-x",
            start: "top center",
            end: "bottom top",
            scrub: true,
            // markers: true,
        },
    });
    const easing = "sine.in";
    tl.fromTo(".mixtitle-r",
        {x: -1.5, y: 0.5},
        {x: "1.86rem", y: "-0.74rem", duration: 1, ease: easing}, 0);
    tl.fromTo(".mixtitle-g",
        {x: 0, y: 0},
        {x: "-0.28rem", y: "1.98rem", duration: 1, ease: easing}, 0);
    tl.fromTo(".mixtitle-b",
        {x: 1.5, y: -0.5},
        {x: "-1.58rem", y: "-1.24rem", duration: 1, ease: easing}, 0);
    tl.to("html",
        {"--mixtitle-blur": "12px", duration: 1, ease: easing}, 0
    );
});
