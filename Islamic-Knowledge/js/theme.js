
/* ==================================
   ISLAMIC KNOWLEDGE
   GLOBAL THEME CONTROLLER
================================== */

(function () {
    "use strict";

    const THEME_KEY = "ik-theme";
    const root = document.documentElement;

    function getSavedTheme() {
        try {
            const saved = localStorage.getItem(THEME_KEY);

            if (saved === "light" || saved === "dark") {
                return saved;
            }
        } catch (error) {
            console.warn("Theme preference storage unavailable.");
        }

        return "light";
    }

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

        const themeSelect = document.getElementById("themeSelect");

        if (themeSelect) {
            themeSelect.value = theme;
        }
    }

    // Apply the saved theme immediately.
    applySavedTheme();

    // Apply again when returning with browser Back/Forward.
    window.addEventListener("pageshow", applySavedTheme);

    // Synchronize theme changes across open tabs.
    window.addEventListener("storage", function (event) {
        if (event.key === THEME_KEY) {
            applySavedTheme();
        }
    });

    // Theme selector exists only on the Settings page.
    document.addEventListener("DOMContentLoaded", function () {
        const themeSelect = document.getElementById("themeSelect");

        if (!themeSelect) return;

        themeSelect.value = getSavedTheme();

        themeSelect.addEventListener("change", function () {
            const selectedTheme = this.value;

            if (
                selectedTheme !== "light" &&
                selectedTheme !== "dark"
            ) {
                return;
            }

            try {
                localStorage.setItem(THEME_KEY, selectedTheme);
            } catch (error) {
                console.warn("Could not save theme preference.");
            }

            applySavedTheme();
        });

        applySavedTheme();
    });
})();
