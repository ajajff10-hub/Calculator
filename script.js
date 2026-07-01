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
  if (num2 === 0) return "Nice try! 😏";
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

let currentOperand = "0";
let previousOperand = "";
let operator = null;
let shouldResetDisplay = false;

function roundResult(number) {
  if (typeof number === "string") return number;
  return Math.round(number * 100000) / 100000;
}

function updateDisplay() {
  currentOperandElement.textContent = currentOperand;

  if (currentOperand === "Nice try! 😏") {
    currentOperandElement.classList.add("error");
  } else {
    currentOperandElement.classList.remove("error");
  }

  previousOperandElement.textContent =
    operator && previousOperand !== "" ? `${previousOperand} ${operator}` : "";
}

function appendNumber(number) {
  if (currentOperand === "Nice try! 😏") clear();

  if (number === "." && currentOperand.includes(".")) return;

  if (currentOperand === "0" && number !== ".") {
    currentOperand = number;
    return;
  }

  if (shouldResetDisplay) {
    currentOperand = number === "." ? "0." : number;
    shouldResetDisplay = false;
    return;
  }

  currentOperand += number;
}

function chooseOperator(selectedOperator) {
  if (currentOperand === "Nice try! 😏") return;

  if (operator !== null && !shouldResetDisplay) {
    calculate();
  }

  previousOperand = currentOperand;
  operator = selectedOperator;
  shouldResetDisplay = true;
}

function calculate() {
  if (operator === null || shouldResetDisplay) return;

  const result = operate(operator, previousOperand, currentOperand);

  currentOperand = roundResult(result).toString();
  previousOperand = "";
  operator = null;
  shouldResetDisplay = true;
}

function clear() {
  currentOperand = "0";
  previousOperand = "";
  operator = null;
  shouldResetDisplay = false;
}

function backspace() {
  if (shouldResetDisplay || currentOperand === "Nice try! 😏") {
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
  if (currentOperand === "0" || currentOperand === "Nice try! 😏") return;

  if (currentOperand.startsWith("-")) {
    currentOperand = currentOperand.slice(1);
  } else {
    currentOperand = "-" + currentOperand;
  }
}

function percent() {
  if (currentOperand === "Nice try! 😏") return;
  currentOperand = (Number(currentOperand) / 100).toString();
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

document.querySelector("[data-action='sign']").addEventListener("click", () => {
  toggleSign();
  updateDisplay();
});

document.querySelector("[data-action='percent']").addEventListener("click", () => {
  percent();
  updateDisplay();
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
    backspace();
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