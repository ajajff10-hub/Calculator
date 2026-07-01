const MAX_DIGITS = 16;
const ERROR_MESSAGE = "Cannot divide by 0!";

const previousOperandElement = document.getElementById("previousOperand");
const currentOperandElement = document.getElementById("currentOperand");
const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");

let currentOperand = "0";
let previousOperand = "";
let operator = null;
let shouldResetDisplay = false;

let lastOperator = null;
let lastOperand = null;

let history = [];

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
  if (num2 === 0) return ERROR_MESSAGE;
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

function countDigits(value) {
  return value
    .toString()
    .replace(".", "")
    .replace("-", "")
    .length;
}

function canAddDigit(value, number) {
  if (number === ".") {
    return !value.includes(".");
  }

  return countDigits(value) < MAX_DIGITS;
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
  if (typeof number === "string") {
    return number;
  }

  const roundedNumber = Math.round(number * 100000000) / 100000000;
  let resultText = roundedNumber.toString();

  if (countDigits(resultText) > MAX_DIGITS) {
    resultText = roundedNumber.toExponential(8);
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

  if (currentOperand === ERROR_MESSAGE) {
    currentOperandElement.classList.add("error");
  } else {
    currentOperandElement.classList.remove("error");
  }

  if (operator && previousOperand !== "") {
    previousOperandElement.textContent = `${previousOperand} ${getSymbol(operator)}`;
  } else {
    previousOperandElement.textContent = "";
  }
}

function appendNumber(number) {
  if (currentOperand === ERROR_MESSAGE) {
    clearCalculator();
  }

  if (shouldResetDisplay) {
    currentOperand = number === "." ? "0." : number;
    shouldResetDisplay = false;
    return;
  }

  if (!canAddDigit(currentOperand, number)) {
    return;
  }

  if (currentOperand === "0" && number !== ".") {
    currentOperand = number;
  } else {
    currentOperand += number;
  }
}
function chooseOperator(selectedOperator) {
  if (currentOperand === ERROR_MESSAGE) {
    return;
  }

  if (operator !== null && !shouldResetDisplay) {
    calculate();
  }

  previousOperand = currentOperand;
  operator = selectedOperator;
  shouldResetDisplay = true;
}

function calculate() {
  if (operator === null && lastOperator === null) {
    return;
  }

  let firstNumber;
  let secondNumber;
  let usedOperator;

  if (operator !== null && !shouldResetDisplay) {
    firstNumber = previousOperand;
    secondNumber = currentOperand;
    usedOperator = operator;

    lastOperator = operator;
    lastOperand = currentOperand;
  } else {
    firstNumber = currentOperand;
    secondNumber = lastOperand;
    usedOperator = lastOperator;
  }

  const result = operate(usedOperator, firstNumber, secondNumber);
  currentOperand = roundResult(result).toString();

  history.unshift(
    `${firstNumber} ${getSymbol(usedOperator)} ${secondNumber} = ${currentOperand}`
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
    const historyItem = document.createElement("div");
    historyItem.classList.add("history-item");
    historyItem.textContent = item;
    historyList.appendChild(historyItem);
  });
}

function clearCalculator() {
  currentOperand = "0";
  previousOperand = "";
  operator = null;
  shouldResetDisplay = false;
  lastOperator = null;
  lastOperand = null;
}
function clearEntry() {
  currentOperand = "0";
  shouldResetDisplay = false;
}

function deleteNumber() {
  if (shouldResetDisplay || currentOperand === ERROR_MESSAGE) {
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
  if (currentOperand === "0" || currentOperand === ERROR_MESSAGE) {
    return;
  }

  if (currentOperand.startsWith("-")) {
    currentOperand = currentOperand.slice(1);
  } else {
    currentOperand = "-" + currentOperand;
  }
}

function percent() {
  if (currentOperand === ERROR_MESSAGE) {
    return;
  }

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
  clearCalculator();
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
    clearCalculator();
  }

  if (event.key === "%") {
    percent();
  }

  updateDisplay();
});

updateDisplay();