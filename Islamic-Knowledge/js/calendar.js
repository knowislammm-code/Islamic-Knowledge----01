/* =========================================
   ISLAMIC KNOWLEDGE
   ISLAMIC CALENDAR
   AlAdhan API
========================================= */


const API_BASE =
    "https://api.aladhan.com/v1";


let currentDate = new Date();


/* =========================================
   DOM ELEMENTS
========================================= */

const calendarGrid =
    document.getElementById("calendarGrid");

const monthHijri =
    document.getElementById("monthHijri");

const monthGregorian =
    document.getElementById("monthGregorian");

const todayHijri =
    document.getElementById("todayHijri");

const todayGregorian =
    document.getElementById("todayGregorian");

const todayArabic =
    document.getElementById("todayArabic");

const eventsContainer =
    document.getElementById("eventsContainer");

const previousMonth =
    document.getElementById("previousMonth");

const nextMonth =
    document.getElementById("nextMonth");

const todayButton =
    document.getElementById("todayButton");


/* =========================================
   MONTH NAMES
========================================= */

const gregorianMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];


const hijriMonths = [
    "Muharram",
    "Safar",
    "Rabi' al-Awwal",
    "Rabi' al-Thani",
    "Jumada al-Awwal",
    "Jumada al-Thani",
    "Rajab",
    "Sha'ban",
    "Ramadan",
    "Shawwal",
    "Dhul-Qi'dah",
    "Dhul-Hijjah"
];


/* =========================================
   ARABIC MONTH NAMES
========================================= */

const hijriArabicMonths = [
    "مُحَرَّم",
    "صَفَر",
    "رَبِيع ٱلْأَوَّل",
    "رَبِيع ٱلْثَّانِي",
    "جُمَادَىٰ ٱلْأُولَىٰ",
    "جُمَادَىٰ ٱلْثَّانِيَة",
    "رَجَب",
    "شَعْبَان",
    "رَمَضَان",
    "شَوَّال",
    "ذُو ٱلْقِعْدَة",
    "ذُو ٱلْحِجَّة"
];


/* =========================================
   API REQUEST
========================================= */

async function fetchCalendar(month, year) {

    const url =
        `${API_BASE}/gToHCalendar/${month}/${year}`;

    try {

        const response =
            await fetch(url);

        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }

        const data =
            await response.json();

        if (
            data.code !== 200 ||
            !data.data
        ) {

            throw new Error(
                "Invalid calendar response."
            );

        }

        return data.data;

    } catch (error) {

        console.error(
            "Calendar API error:",
            error
        );

        throw error;

    }
}


/* =========================================
   FETCH TODAY
========================================= */

async function fetchToday() {

    const now = new Date();

    const day =
        String(now.getDate())
            .padStart(2, "0");

    const month =
        String(now.getMonth() + 1)
            .padStart(2, "0");

    const year =
        now.getFullYear();


    const url =
        `${API_BASE}/gToH/${day}-${month}-${year}`;


    try {

        const response =
            await fetch(url);

        if (!response.ok) {

            throw new Error(
                "Unable to fetch today's date."
            );

        }

        const data =
            await response.json();

        return data.data;

    } catch (error) {

        console.error(
            "Today's date error:",
            error
        );

        return null;

    }
}


/* =========================================
   FORMAT TODAY
========================================= */

async function loadToday() {

    const data =
        await fetchToday();


    if (!data) {

        todayHijri.textContent =
            "Unable to load date";

        todayGregorian.textContent =
            "Please try again.";

        return;

    }


    const hijri =
        data.hijri;

    const gregorian =
        data.gregorian;


    todayHijri.textContent =
        `${hijri.day} ${hijri.month.en} ${hijri.year} AH`;


    todayGregorian.textContent =
        `${gregorian.day} ${gregorian.month.en} ${gregorian.year}`;


    todayArabic.textContent =
        `${hijri.day} ${hijri.month.ar} ${hijri.year}`;
}


/* =========================================
   LOAD MONTH
========================================= */

async function loadMonth() {

    calendarGrid.innerHTML = `
        <div class="calendar-loading"
             style="grid-column:1/-1;">
            Loading calendar...
        </div>
    `;


    const month =
        currentDate.getMonth() + 1;

    const year =
        currentDate.getFullYear();


    try {

        const data =
            await fetchCalendar(
                month,
                year
            );


        renderCalendar(data);

    } catch (error) {

        calendarGrid.innerHTML = `
            <div class="calendar-loading"
                 style="grid-column:1/-1;">

                Unable to load calendar.

                <br>

                <button
                    onclick="loadMonth()"
                    class="calendar-today-button"
                    style="margin-top:12px;">

                    Try Again

                </button>

            </div>
        `;

    }
}


/* =========================================
   RENDER CALENDAR
========================================= */

function renderCalendar(data) {

    calendarGrid.innerHTML = "";


    if (!data || data.length === 0) {

        calendarGrid.innerHTML = `
            <div class="calendar-loading">
                No calendar data available.
            </div>
        `;

        return;

    }


    const firstDay =
        new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
        ).getDay();


    /* EMPTY DAYS BEFORE MONTH */

    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const empty =
            document.createElement("div");

        empty.className =
            "calendar-day empty";

        calendarGrid.appendChild(empty);

    }


    /* DAYS */

    data.forEach(function (item) {

        const day =
            item.gregorian.day;


        const hijriDay =
            item.hijri.day;


        const cell =
            document.createElement("div");

        cell.className =
            "calendar-day";


        /* CHECK TODAY */

        const itemDate =
            item.gregorian.date;


        const today =
            new Date();


        const todayString =
            `${String(today.getDate())
                .padStart(2, "0")}-` +
            `${String(today.getMonth() + 1)
                .padStart(2, "0")}-` +
            `${today.getFullYear()}`;


        if (
            itemDate === todayString
        ) {

            cell.classList.add("today");

        }


        cell.innerHTML = `

            <div class="gregorian-number">
                ${day}
            </div>

            <div class="hijri-number">
                ${hijriDay}
                ${item.hijri.month.en}
            </div>

        `;


        calendarGrid.appendChild(cell);

    });


    /* UPDATE HEADER */

    const first =
        data[0].hijri;

    const last =
        data[data.length - 1].hijri;


    monthHijri.textContent =
        `${first.month.en} ${first.year} AH`;


    monthGregorian.textContent =
        `${gregorianMonths[
            currentDate.getMonth()
        ]} ${currentDate.getFullYear()}`;

}


/* =========================================
   LOAD ISLAMIC EVENTS
========================================= */

async function loadEvents() {

    eventsContainer.innerHTML = `
        <div class="calendar-loading">
            Loading Islamic events...
        </div>
    `;


    const month =
        currentDate.getMonth() + 1;

    const year =
        currentDate.getFullYear();


    try {

        const data =
            await fetchCalendar(
                month,
                year
            );


        const events = [];


        data.forEach(function (item) {

            if (
                item.hijri.holidays &&
                item.hijri.holidays.length
            ) {

                item.hijri.holidays.forEach(
                    function (holiday) {

                        events.push({
                            name: holiday,
                            hijri:
                                `${item.hijri.day} ${item.hijri.month.en} ${item.hijri.year}`,
                            gregorian:
                                `${item.gregorian.day} ${item.gregorian.month.en} ${item.gregorian.year}`
                        });

                    }
                );

            }

        });


        renderEvents(events);


    } catch (error) {

        eventsContainer.innerHTML = `
            <div class="calendar-loading">
                Islamic events could not be loaded.
            </div>
        `;

    }

}


/* =========================================
   RENDER EVENTS
========================================= */

function renderEvents(events) {

    eventsContainer.innerHTML = "";


    if (
        events.length === 0
    ) {

        eventsContainer.innerHTML = `
            <div class="calendar-loading">
                No major Islamic events are listed
                for this month.
            </div>
        `;

        return;

    }


    events.forEach(function (event) {

        const card =
            document.createElement("article");

        card.className =
            "event-card";


        card.innerHTML = `

            <h3>
                ${escapeHTML(event.name)}
            </h3>

            <p>
                ${escapeHTML(event.hijri)}
            </p>

            <div class="event-date">
                ${escapeHTML(event.gregorian)}
            </div>

        `;


        eventsContainer.appendChild(card);

    });

}


/* =========================================
   HTML ESCAPE
========================================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value;

    return div.innerHTML;

}


/* =========================================
   PREVIOUS MONTH
========================================= */

previousMonth.addEventListener(
    "click",
    function () {

        currentDate =
            new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() - 1,
                1
            );

        loadMonth();
        loadEvents();

    }
);


/* =========================================
   NEXT MONTH
========================================= */

nextMonth.addEventListener(
    "click",
    function () {

        currentDate =
            new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                1
            );

        loadMonth();
        loadEvents();

    }
);


/* =========================================
   TODAY
========================================= */

todayButton.addEventListener(
    "click",
    function () {

        currentDate =
            new Date();

        loadMonth();
        loadEvents();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* =========================================
   INITIAL LOAD
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadToday();

        loadMonth();

        loadEvents();

    }
);