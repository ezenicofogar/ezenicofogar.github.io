const DarkModeController = (()=>{
    class DarkModeControllerClass {
        _apply() {
            document.documentElement.classList.toggle(
                "dark",
                localStorage.theme === "dark" ||
                (!("theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches));
        }
        constructor() {
            this._apply();
        }
        Dark() {
            localStorage.theme = "dark";
            this._apply();
        }
        Light() {
            localStorage.theme = "light";
            this._apply();
        }
        System() {
            localStorage.removeItem("theme");
            this._apply();
        }
        Get() {
            return ("theme" in localStorage) ? localStorage.theme : "System";
        }
    }
    return new DarkModeControllerClass();
})();
