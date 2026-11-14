
(() => {
    "use strict";

    const KAABA = {
        latitude: 21.4225,
        longitude: 39.8262
    };

    const statusText = document.getElementById("locationStatus");
    const bearingValue = document.getElementById("bearingValue");
    const bearingText = document.getElementById("bearingText");
    const locationName = document.getElementById("locationName");
    const needle = document.getElementById("compassNeedle");
    const compassHelp = document.getElementById("compassHelp");

    if (!statusText || !needle) return;

    let qiblaBearing = null;
    let deviceHeading = null;
    let locationReady = false;
    let compassReady = false;

    const normalize = value => ((value % 360) + 360) % 360;

    function calculateQibla(latitude, longitude) {
        const rad = degrees => degrees * Math.PI / 180;
        const deg = radians => radians * 180 / Math.PI;

        const lat1 = rad(latitude);
        const lat2 = rad(KAABA.latitude);
        const deltaLon = rad(KAABA.longitude - longitude);

        const y = Math.sin(deltaLon) * Math.cos(lat2);

        const x =
            Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) *
            Math.cos(deltaLon);

        return normalize(deg(Math.atan2(y, x)));
    }

    function getScreenAngle() {
        return Number(
            screen.orientation?.angle ??
            window.orientation ??
            0
        );
    }

    function updateNeedle() {
        if (qiblaBearing === null) return;

        // Before the live sensor starts, show the north-referenced bearing.
        if (deviceHeading === null) {
            needle.style.transform =
                `translate(-50%, -50%) rotate(${qiblaBearing}deg)`;

            bearingText.textContent =
                "Bearing measured clockwise from true north.";

            return;
        }

        // Calculate Qibla direction relative to the phone.
        const relativeDirection =
            normalize(qiblaBearing - deviceHeading);

        needle.style.transform =
            `translate(-50%, -50%) rotate(${relativeDirection}deg)`;

        const difference = Math.min(
            relativeDirection,
            360 - relativeDirection
        );

        if (difference <= 5) {
            bearingText.textContent =
                "You are facing the Qibla direction.";
        } else {
            bearingText.textContent =
                `Turn approximately ${Math.round(difference)}° ${
                    relativeDirection < 180 ? "clockwise" : "anticlockwise"
                } to face Qibla.`;
        }
    }

    function handleOrientation(event) {
        let heading = null;

        // iPhone Safari compass reading.
        if (
            typeof event.webkitCompassHeading === "number" &&
            Number.isFinite(event.webkitCompassHeading)
        ) {
            heading = event.webkitCompassHeading;
        }

        // Android absolute compass reading.
        else if (
            event.absolute === true &&
            typeof event.alpha === "number"
        ) {
            heading = 360 - event.alpha + getScreenAngle();
        }

        // Never treat a relative reading as true north.
        if (heading === null || !Number.isFinite(heading)) {
            return;
        }

        deviceHeading = normalize(heading);
        compassReady = true;

        compassHelp.textContent =
            `Live compass active • Phone heading: ${Math.round(deviceHeading)}°`;

        if (locationReady) {
            statusText.textContent =
                "Location and live compass are working.";
        }

        updateNeedle();
    }

    function startCompass() {
        if (!window.isSecureContext) {
            compassHelp.textContent =
                "Live compass requires HTTPS or localhost.";
            return;
        }

        if (!("DeviceOrientationEvent" in window)) {
            compassHelp.textContent =
                "This device or browser does not support a compass sensor.";
            return;
        }

        try {
            window.addEventListener(
                "deviceorientation",
                handleOrientation,
                true
            );

            window.addEventListener(
                "deviceorientationabsolute",
                handleOrientation,
                true
            );

            compassHelp.textContent =
                "Connecting to your phone's compass sensor...";

            // Detect whether the sensor sends readings.
            setTimeout(() => {
                if (!compassReady) {
                    compassHelp.textContent =
                        "No absolute compass readings received. Check device sensor support and browser permissions.";

                    if (locationReady) {
                        statusText.textContent =
                            "Location found, but the live compass is unavailable.";
                    }
                }
            }, 10000);

        } catch (error) {
            compassHelp.textContent =
                "Unable to access the compass sensor.";
        }
    }

    function findLocation() {
        if (!navigator.geolocation) {
            statusText.textContent =
                "Your browser does not support location services.";
            return;
        }

        if (!window.isSecureContext) {
            statusText.textContent =
                "Location requires HTTPS or localhost.";
            return;
        }

        statusText.textContent =
            "Detecting your location... Please allow location access.";

        navigator.geolocation.getCurrentPosition(

            position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                qiblaBearing =
                    calculateQibla(latitude, longitude);

                locationReady = true;

                bearingValue.textContent =
                    `${qiblaBearing.toFixed(1)}°`;

                locationName.textContent =
                    `Location accuracy: approximately ${Math.round(position.coords.accuracy)} metres`;

                statusText.textContent =
                    compassReady
                        ? "Location and live compass are working."
                        : "Location detected. Connecting to live compass...";

                updateNeedle();
            },

            error => {
                const messages = {
                    1: "Location permission denied. Allow location access in browser settings.",
                    2: "Location unavailable. Check your device location settings.",
                    3: "Location request timed out. Please refresh and try again."
                };

                statusText.textContent =
                    messages[error.code] || "Unable to detect your location.";
            },

            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 0
            }
        );
    }

    // Automatically start both features when the Qibla page opens.
    startCompass();
    findLocation();

    // Keep the display correct when the phone screen rotates.
    window.addEventListener("orientationchange", updateNeedle);

    window.addEventListener("deviceorientation", () => {
        if (deviceHeading !== null) updateNeedle();
    });

})();
