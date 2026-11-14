
/* ==================================
   ISLAMIC KNOWLEDGE
   APPLICATION SETTINGS
================================== */

(() => {

    const THEME_KEY = "ik-theme";
    const root = document.documentElement;

    // Read the saved theme
    function getSavedTheme() {
        try {
            const savedTheme = localStorage.getItem(THEME_KEY);

            if (savedTheme === "light" || savedTheme === "dark") {
                return savedTheme;
            }
        } catch (error) {
            console.warn("Theme preference storage unavailable.");
        }

        return "light";
    }

    // Apply the saved theme
    function applySavedTheme() {

        const theme = getSavedTheme();

        root.setAttribute("data-theme", theme);

        const themeColor = document.querySelector(
            'meta[name="theme-color"]'
        );

        if (themeColor) {
            themeColor.content =
                theme === "dark" ? "#10251D" : "#F8F7F3";
        }
    }

    // Apply theme immediately
    applySavedTheme();

    // Reapply when returning to this page using Back/Forward
    window.addEventListener("pageshow", applySavedTheme);

    // Synchronize changes made in another browser tab
    window.addEventListener("storage", function (event) {

        if (event.key === THEME_KEY) {
            applySavedTheme();
        }

    });

    console.log("Islamic Knowledge theme system initialized.");

})();
