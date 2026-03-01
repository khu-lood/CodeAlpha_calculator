const display = document.getElementById("display");
const buttons = document.querySelectorAll(".buttons button");
const clickSound = document.getElementById("clickSound");
const historyBtn = document.getElementById("historyBtn");
const historyPanel = document.getElementById("historyPanel");
const closeHistory = document.getElementById("closeHistory");
const clearHistory = document.getElementById("clearHistory");
const historyList = document.getElementById("historyList");

let calcHistory = JSON.parse(localStorage.getItem("calcHistory")) || [];

// Toggle panel
historyBtn.addEventListener("click", () => {
  historyPanel.classList.add("active");
  renderHistory();
});

closeHistory.addEventListener("click", () => {
  historyPanel.classList.remove("active");
});

// Render history
function renderHistory() {
  historyList.innerHTML = "";

  if (calcHistory.length === 0) {
    historyList.innerHTML = "<p>No history yet</p>";
    return;
  }

  calcHistory.slice().reverse().forEach(item => {
    const div = document.createElement("div");
    div.classList.add("history-item");
    div.textContent = item;

    div.addEventListener("click", () => {
      document.getElementById("display").value = item;
      historyPanel.classList.remove("active");
    });

    historyList.appendChild(div);
  });
}

// Save calculation (CALL THIS WHEN = IS PRESSED)
function saveToHistory(calculation) {
  calcHistory.push(calculation);

  // limit to last 10
  if (calcHistory.length > 10) {
    calcHistory.shift();
  }

  localStorage.setItem("calcHistory", JSON.stringify(calcHistory));
}

// Clear history
clearHistory.addEventListener("click", () => {
  calcHistory = [];
  localStorage.removeItem("calcHistory");
  renderHistory();
});


let memory = 0;

// Add blinking cursor class once
display.classList.add("cursor");

// 🔥 Main function that handles ALL input
function handleInput(value) {

  // Play sound
  clickSound.currentTime = 0;
  clickSound.play().catch(() => {});

  if (value === "C") {
    display.value = "";
  }

  else if (value === "DEL") {
    display.value = display.value.slice(0, -1);
  }

  else if (value === "%") {
    if (display.value !== "")
      display.value = eval(display.value) / 100;
  }

  else if (value === "neg") {
    if (display.value !== "")
      display.value = display.value * -1;
  }

  else if (value === "M+") {
    memory += Number(display.value || 0);
  }

  else if (value === "M-") {
    memory -= Number(display.value || 0);
  }

  else if (value === "RM") {
    display.value = memory;
  }

  else if (value === "=") {
  try {
    if (!display.value.trim()) return;

    const expression = display.value;

    if (!/[0-9]/.test(expression)) return;

    const result = eval(expression);

    if (result === undefined || result === null || isNaN(result)) return;

    saveToHistory(expression + " = " + result);

    display.value = result;

  } catch {
    display.value = "";
  }
}

  else {
    display.value += value;
  }
}


// 🖱 Button Click Support
buttons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.getAttribute("data-value");

    if (button.classList.contains("equal")) {
      handleInput("=");
    } else {
      handleInput(value);
    }
  });
});

// ⌨️ KEYBOARD SUPPORT
document.addEventListener("keydown", (event) => {

  const key = event.key;

  if (!isNaN(key) || key === ".") {
    handleInput(key);
  }

  if (["+", "-", "*", "/"].includes(key)) {
    handleInput(key);
  }

  if (key === "Enter" || key === "=") {
    event.preventDefault();
    handleInput("=");
  }

  if (key === "Backspace") {
    handleInput("DEL");
  }

  if (key === "Escape") {
    handleInput("C");
  }

});

