// =======================
// CONFIG
// =======================

const hoursPerDay = 8;
const startDate = new Date(2026, 0, 6); // 6 Ian 2026 = SC1
let current = new Date();

const calendar = document.getElementById("calendar");
const monthTitle = document.getElementById("monthTitle");
const overtimeText = document.getElementById("overtimeText");
const footer = document.getElementById("todayFooter");

// =======================
// SHIFT LOGIC
// =======================

function shiftFor(date) {
  const diff = Math.floor((date - startDate) / 86400000);
  const cycle = ["sc1", "sc1", "sc2", "sc2", "sc3", "sc3", "lib", "lib"];
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

  // 👇 NUMĂR CORECT DE CELULE (5 sau 6 rânduri)
  const totalCells = Math.ceil((start + daysInMonth) / 7) * 7;

  let worked = 0;
  let workdays = 0;

  for (let i = 0; i < totalCells; i++) {
    const d = new Date(y, m, i - start + 1);
    const div = document.createElement("div");
    div.className = "day";

    if (d.getMonth() !== m) {
      div.classList.add("other");
    } else {
      const shift = shiftFor(d);
      div.classList.add(shift);

      if (shift !== "lib") worked += hoursPerDay;
      if (d.getDay() > 0 && d.getDay() < 6) workdays++;
    }

    if (d.toDateString() === new Date().toDateString()) {
      div.classList.add("today");
    }

    div.innerHTML = `
      <div>${d.getDate()}</div>
      <div>${shiftFor(d).toUpperCase()}</div>
    `;

    calendar.appendChild(div);
  }

  // =======================
  // OVERTIME
  // =======================

  const overtime = worked - workdays * hoursPerDay;
  overtimeText.textContent =
    overtime > 0
      ? `${overtime} ore… forța e cu tine`
      : `${overtime} ore… portofelul plânge`;

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
