const header = document.getElementById("header");
let lastPosition = window.scrollY;
window.addEventListener("scroll", () => {
    let newPosition = window.scrollY;
    if (newPosition > lastPosition) {
        header.style.transform = "translateY(-110%)";
    }
    else if (newPosition < lastPosition) {
        header.style.transform = "translateY(0%)";
    }
    lastPosition = newPosition;
});