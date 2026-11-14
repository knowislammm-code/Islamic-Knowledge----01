
/* ==================================
   ISLAMIC KNOWLEDGE
   PAGE NAVIGATION
================================== */

document.addEventListener("DOMContentLoaded", () => {

    const currentPath = window.location.pathname;
    const currentFile = currentPath.split("/").pop();

    const pageNames = {
        "index.html": "home",
        "": "home",
        "quran.html": "quran",
        "hadith.html": "hadith",
        "calendar.html": "calendar",
        "qibla.html": "qibla",
        "topics.html": "topics",
        "stories.html": "stories"
    };

    const currentPage = pageNames[currentFile] || "home";

    document.querySelectorAll(".nav-link, .bottom-link").forEach(link => {
        const linkPage = link.getAttribute("data-page");

        if (linkPage === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        }
    });

    /*
       iOS COMPASS PERMISSION

       The Qibla navigation tap is used to request
       compass permission before opening the Qibla page.
    */

    document.addEventListener("click", async event => {

        const qiblaLink = event.target.closest(
            'a[data-page="qibla"]'
        );

        if (!qiblaLink) return;

        if (
            typeof DeviceOrientationEvent === "undefined" ||
            typeof DeviceOrientationEvent.requestPermission !== "function"
        ) {
            return;
        }

        event.preventDefault();

        try {
            const permission =
                await DeviceOrientationEvent.requestPermission();

            if (permission === "granted") {
                sessionStorage.setItem("ik-compass-permission", "granted");
            } else {
                sessionStorage.setItem("ik-compass-permission", "denied");
            }

        } catch (error) {
            sessionStorage.setItem("ik-compass-permission", "denied");
        }

        window.location.href = qiblaLink.href;

    });

    console.log("Navigation initialized:", currentPage);

});
