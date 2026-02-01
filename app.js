// =======================
// CONFIG
// =======================

const hoursPerDay = 8;

// 6 Ian 2026 = SC1 (ziua 0 din ciclu)
const startDayNumber = dayNumber(2026, 0, 6);

let current = new Date();

const calendar = document.getElementById("calendar");
const monthTitle = document.getElementById("monthTitle");
const overtimeText = document.getElementById("overtimeText");
const footer = document.getElementById("todayFooter");

// =======================
// DAY NUMBER (fără timp)
// =======================
// Transformă o dată într-un număr unic de zile
// fără ore, fără DST, fără fus orar

function dayNumber(y, m, d) {
  return Math.floor(
    Date.UTC(y, m, d) / 86400000
  );
}

// =======================
// SHIFT LOGIC (DOAR ZILE)
// =======================

const cycle = ["sc1", "sc1", "sc2", "sc2", "sc3", "sc3", "lib", "lib"];

function shiftFor(date) {
  const dn = dayNumber(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const diff = dn - startDayNumber;
  return cycle[(diff % 8 + 8) % 8];
}

// =======================
// RENDER
// =======================

function render() {
  calendar.innerHTML = "";

  const y = current.getFullYear();
  const m = current.getMonth();

  // TITLU LUNĂ
  monthTitle.textContent =
    current
      .toLocaleDateString("ro-RO", { month: "long", year: "numeric" })
      .toUpperCase();

  const first = new Date(y, m, 1);
  const start = (first.getDay() + 6) % 7; // luni = 0
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  // 5 sau 6 rânduri, exact cât trebuie
  const totalCells = Math.ceil((start + daysInMonth) / 7) * 7;

  let worked = 0;
  let workdays = 0;

  for (let i = 0; i < totalCells; i++) {
    const d = new Date(y, m, i - start + 1);
    const div = document.createElement("div");
    div.className = "day";

    if (d.getMonth() !== m) {
  div.classList.add("other");
  div.innerHTML = `
    <div>${d.getDate()}</div>
    <div></div>
  `;
}
 else {
      const shift = shiftFor(d);
      div.classList.add(shift);

      if (shift !== "lib") worked += hoursPerDay;
      if (d.getDay() > 0 && d.getDay() < 6) workdays++;

      div.innerHTML = `
        <div>${d.getDate()}</div>
        <div>${shift.toUpperCase()}</div>
      `;
    }

    // azi
    const today = new Date();
    if (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    ) {
      div.classList.add("today");
    }

    calendar.appendChild(div);
  }

  // =======================
  // OVERTIME
  // =======================

  const overtime = worked - workdays * hoursPerDay;

  overtimeText.textContent =
    overtime > 0
      ? `${overtime} ore… forța e cu tine 💪`
      : `${overtime} ore… portofelul plânge 😭`;

  overtimeText.className = overtime > 0 ? "positive" : "negative";

  // =======================
  // FOOTER
  // =======================

  footer.textContent =
    "Azi e: " +
    new Date().toLocaleDateString("ro-RO", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
}

// =======================
// NAVIGATION
// =======================

document.getElementById("prev").onclick = () => {
  current.setMonth(current.getMonth() - 1);
  render();
};

document.getElementById("next").onclick = () => {
  current.setMonth(current.getMonth() + 1);
  render();
};

document.getElementById("todayBtn").onclick = () => {
  current = new Date();
  render();
};

// =======================
// INIT
// =======================

render();
