const dmLightIcon  = document.getElementById("dm-mode-ico-light");
const dmDarkIcon   = document.getElementById("dm-mode-ico-dark");
const dmModeBtn    = document.getElementById("dm-mode-btn");
const dmDefaultBtn = document.getElementById("dm-default-btn");
const dmSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
let dmDark         = null;

// INITIAL
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && dmSystemDark)) {
    dmDark = true;
    document.documentElement.classList.add('dark');
    background.context.uniform1f(background.uDarkMode, 1.0);
} else {
    dmDark = false;
    document.documentElement.classList.remove('dark');
    background.context.uniform1f(background.uDarkMode, -1.0);
}
if ('theme' in localStorage) {
    dmDefaultBtn.classList.remove('hidden');
}

function dmToggle() {
    if (dmDark) {
        dmDark = false;
        document.documentElement.classList.remove('dark');
        background.context.uniform1f(background.uDarkMode, -1.0);
    } else {
        dmDark = true;
        document.documentElement.classList.add('dark');
        background.context.uniform1f(background.uDarkMode, 1.0);
    }
}

dmDefaultBtn.addEventListener('click', () => {
    dmDefaultBtn.classList.add('hidden');
    localStorage.removeItem('theme');
    if (dmDark != dmSystemDark) {
        dmToggle();
    }
})

dmModeBtn.addEventListener('click', () => {
    dmToggle();
    localStorage.theme = dmDark ? 'dark' : 'light';
    dmDefaultBtn.classList.remove('hidden');
})
