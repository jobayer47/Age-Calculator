(function setMaxForDateInput() {
    const dob = document.getElementById("dob");
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    dob.max = `${yyyy}-${mm}-${dd}`;
})();

const $ = (id) => document.getElementById(id);
const yearsEl = $("years");
const monthsEl = $("months");
const daysEl = $("days");
const errorEl = $("error");
const summaryEl = $("summary");

$("calcBtn").addEventListener("click", handleCalculate);
$("resetBtn").addEventListener("click", resetAll);

function resetAll() {
    $("dob").value = "";
    errorEl.textContent = "";
    setResult("--", "--", "--");
    summaryEl.textContent = "আপনার বয়স দেখতে জন্মতারিখ দিন, তারপর Calculate চাপুন।";
}

function setResult(y, m, d) {
    yearsEl.textContent = y;
    monthsEl.textContent = m;
    daysEl.textContent = d;
}

function handleCalculate() {
    errorEl.textContent = "";

    const dobStr = $("dob").value;
    if (!dobStr) {
        errorEl.textContent = "দয়া করে জন্মতারিখ দিন।";
        return;
    }

    const birth = new Date(dobStr + "T00:00:00");
    const now = new Date();

    if (birth > now) {
        errorEl.textContent = "ভবিষ্যতের কোনো তারিখ দেওয়া যাবে না।";
        setResult("--", "--", "--");
        summaryEl.textContent = "সঠিক জন্মতারিখ দিন।";
        return;
    }

    const { years, months, days } = diffYMD(birth, now);
    setResult(years, months, days);

    const totalDays = Math.floor((stripTime(now) - stripTime(birth)) / (1000 * 60 * 60 * 24));
    summaryEl.textContent = `মোট আনুমানিক ${totalDays.toLocaleString()} দিন হয়েছে।`;
}

function daysInMonth(year, monthIndex) {
    return new Date(year, monthIndex + 1, 0).getDate();
}

function stripTime(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function diffYMD(fromDate, toDate) {
    let y1 = fromDate.getFullYear();
    let m1 = fromDate.getMonth();
    let d1 = fromDate.getDate();

    let y2 = toDate.getFullYear();
    let m2 = toDate.getMonth();
    let d2 = toDate.getDate();

    let day = d2 - d1;
    let month = m2 - m1;
    let year = y2 - y1;

    if (day < 0) {
        const borrowMonthIndex = (m2 - 1 + 12) % 12;
        const borrowYear = borrowMonthIndex === 11 ? y2 - 1 : y2;
        day += daysInMonth(borrowYear, borrowMonthIndex);
        month -= 1;
    }

    if (month < 0) {
        month += 12;
        year -= 1;
    }

    if (year < 0) {
        year = 0;
        month = 0;
        day = 0;
    }

    return { years: year, months: month, days: day };
}