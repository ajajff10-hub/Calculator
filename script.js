function add(num1, num2) {
  return num1 + num2;
}

function subtract(num1, num2) {
  return num1 - num2;
}

function multiply(num1, num2) {
  return num1 * num2;
}

function divide(num1, num2) {
  if (num2 === 0) return "Cannot divide by 0!";
  return num1 / num2;
}

function operate(operator, num1, num2) {
  num1 = Number(num1);
  num2 = Number(num2);

  switch (operator) {
    case "+":
      return add(num1, num2);
    case "-":
      return subtract(num1, num2);
    case "*":
      return multiply(num1, num2);
    case "/":
      return divide(num1, num2);
    default:
      return null;
  }
}

const previousOperandElement = document.getElementById("previousOperand");
const currentOperandElement = document.getElementById("currentOperand");
const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");

let currentOperand = "0";
let previousOperand = "";
let operator = null;
let shouldResetDisplay = false;
let history = [];

function countDigits(value) {
  return value.toString().replace(".", "").replace("-", "").length;
}

function canAddDigit(value, number) {
  if (number === ".") return !value.includes(".");
  return countDigits(value) < 16;
}

function resizeDisplayText() {
  const digits = countDigits(currentOperand);

  if (digits <= 7) {
    currentOperandElement.style.fontSize = "4rem";
  } else if (digits <= 10) {
    currentOperandElement.style.fontSize = "3.3rem";
  } else if (digits <= 13) {
    currentOperandElement.style.fontSize = "2.7rem";
  } else {
    currentOperandElement.style.fontSize = "2.2rem";
  }
}

function roundResult(number) {
  if (typeof number === "string") return number;

  let result = Math.round(number * 100000000) / 100000000;
  let resultText = result.toString();

  if (countDigits(resultText) > 16) {
    resultText = result.toExponential(8);
  }

  return resultText;
}

function getSymbol(op) {
  if (op === "*") return "×";
  if (op === "/") return "÷";
  return op;
}

function updateDisplay() {
  currentOperandElement.textContent = currentOperand;
  resizeDisplayText();

  if (currentOperand === "Cannot divide by 0!") {
    currentOperandElement.classList.add("error");
  } else {
    currentOperandElement.classList.remove("error");
  }

  previousOperandElement.textContent =
    operator && previousOperand !== ""
      ? `${previousOperand} ${getSymbol(operator)}`
      : "";
}

function appendNumber(number) {
  if (currentOperand === "Cannot divide by 0!") clear();

  if (shouldResetDisplay) {
    currentOperand = number === "." ? "0." : number;
    shouldResetDisplay = false;
    return;
  }

  if (!canAddDigit(currentOperand, number)) return;

  if (currentOperand === "0" && number !== ".") {
    currentOperand = number;
  } else {
    currentOperand += number;
  }
}

function chooseOperator(selectedOperator) {
  if (currentOperand === "Cannot divide by 0!") return;

  if (operator !== null && !shouldResetDisplay) {
    calculate();
  }

  previousOperand = currentOperand;
  operator = selectedOperator;
  shouldResetDisplay = true;
}

function calculate() {
  if (operator === null || shouldResetDisplay) return;

  const oldPrevious = previousOperand;
  const oldCurrent = currentOperand;
  const oldOperator = operator;

  const result = operate(operator, previousOperand, currentOperand);
  currentOperand = roundResult(result).toString();

  history.unshift(
    `${oldPrevious} ${getSymbol(oldOperator)} ${oldCurrent} = ${currentOperand}`
  );

  updateHistory();

  previousOperand = "";
  operator = null;
  shouldResetDisplay = true;
}

function updateHistory() {
  if (history.length === 0) {
    historyList.textContent = "No history yet";
    return;
  }

  historyList.innerHTML = "";

  history.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("history-item");
    div.textContent = item;
    historyList.appendChild(div);
  });
}

function clear() {
  currentOperand = "0";
  previousOperand = "";
  operator = null;
  shouldResetDisplay = false;
}

function clearEntry() {
  currentOperand = "0";
  shouldResetDisplay = false;
}

function deleteNumber() {
  if (shouldResetDisplay || currentOperand === "Cannot divide by 0!") {
    currentOperand = "0";
    shouldResetDisplay = false;
    return;
  }

  if (currentOperand.length === 1) {
    currentOperand = "0";
  } else {
    currentOperand = currentOperand.slice(0, -1);
  }
}

function toggleSign() {
  if (currentOperand === "0" || currentOperand === "Cannot divide by 0!") return;

  if (currentOperand.startsWith("-")) {
    currentOperand = currentOperand.slice(1);
  } else {
    currentOperand = "-" + currentOperand;
  }
}

function percent() {
  if (currentOperand === "Cannot divide by 0!") return;
  currentOperand = roundResult(Number(currentOperand) / 100).toString();
}

document.querySelectorAll("[data-number]").forEach(button => {
  button.addEventListener("click", () => {
    appendNumber(button.dataset.number);
    updateDisplay();
  });
});

document.querySelectorAll("[data-operator]").forEach(button => {
  button.addEventListener("click", () => {
    chooseOperator(button.dataset.operator);
    updateDisplay();
  });
});

document.querySelector("[data-action='calculate']").addEventListener("click", () => {
  calculate();
  updateDisplay();
});

document.querySelector("[data-action='clear']").addEventListener("click", () => {
  clear();
  updateDisplay();
});

document.querySelector("[data-action='clear-entry']").addEventListener("click", () => {
  clearEntry();
  updateDisplay();
});

document.querySelector("[data-action='delete']").addEventListener("click", () => {
  deleteNumber();
  updateDisplay();
});

document.querySelector("[data-action='sign']").addEventListener("click", () => {
  toggleSign();
  updateDisplay();
});

document.querySelector("[data-action='percent']").addEventListener("click", () => {
  percent();
  updateDisplay();
});

document.querySelector("[data-action='history']").addEventListener("click", () => {
  historyPanel.classList.toggle("show");
});

window.addEventListener("keydown", event => {
  if (event.key >= "0" && event.key <= "9") {
    appendNumber(event.key);
  }

  if (event.key === ".") {
    appendNumber(".");
  }

  if (["+", "-", "*", "/"].includes(event.key)) {
    chooseOperator(event.key);
  }

  if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    calculate();
  }

  if (event.key === "Backspace") {
    deleteNumber();
  }

  if (event.key === "Escape") {
    clear();
  }

  if (event.key === "%") {
    percent();
  }

  updateDisplay();
});

updateDisplay();