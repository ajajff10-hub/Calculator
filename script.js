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
    if (num2 === 0) return "Nice try!"; 
    return num1 / num2; 
}

function operate(num1, operator, num2) {
    num1 = Number(num1);
    num2 = Number(num2);
    switch (operator) {
        case '+': return add(num1, num2);
        case '-': return subtract(num1, num2);
        case '*': return multiply(num1, num2);
        case '/': return divide(num1, num2);
        default: return "Invalid Operator";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const previousOperandElement = document.getElementById('previousOperand');
    const currentOperandElement = document.getElementById('currentOperand');

    let currentOperand = '0';
    let previousOperand = '';
    let operation = null;
    let shouldResetDisplay = false; 

    function roundResult(number) {
        if (typeof number === 'string') return number; 
        return Math.round(number * 100000) / 100000;
    }

    function updateDisplay() {
        currentOperandElement.innerText = currentOperand;
        if (operation != null) {
            let displaySymbol = operation === '*' ? '×' : operation === '/' ? '÷' : operation;
            previousOperandElement.innerText = `${previousOperand} ${displaySymbol}`;
        } else {
            previousOperandElement.innerText = previousOperand;
        }
    }

    function appendNumber(number) {
        if (number === '.' && currentOperand.includes('.')) return;
        
        if ((currentOperand === '0' && number !== '.') || shouldResetDisplay) {
            currentOperand = number.toString();
            shouldResetDisplay = false; 
        } else {
            currentOperand = currentOperand.toString() + number.toString();
        }
    }

    function clear() {
        currentOperand = '0';
        previousOperand = '';
        operation = null;
        shouldResetDisplay = false;
    }

    function deleteNumber() {
        if (currentOperand === '0') return;
        currentOperand = currentOperand.toString().slice(0, -1);
        if (currentOperand === '') { currentOperand = '0'; }
    }

    function chooseOperation(selectedOperation) {
        if (currentOperand === '0' && previousOperand === '') return; 
        
        if (previousOperand !== '') {
            compute();
        }
        
        operation = selectedOperation;
        previousOperand = currentOperand; 
        shouldResetDisplay = true; 
    }

    function compute() {
        let computation;
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        computation = operate(prev, operation, current);
        
        currentOperand = roundResult(computation).toString();
        operation = null;
        previousOperand = '';
    }

    document.querySelectorAll('[data-number]').forEach(button => {
        button.addEventListener('click', () => {
            appendNumber(button.getAttribute('data-number'));
            updateDisplay();
        });
    });

    document.querySelectorAll('[data-operator]').forEach(button => {
        button.addEventListener('click', () => {
            chooseOperation(button.getAttribute('data-operator'));
            updateDisplay();
        });
    });

    const equalsButton = document.querySelector('[data-action="calculate"]');
    if (equalsButton) {
        equalsButton.addEventListener('click', () => {
            compute();
            updateDisplay();
        });
    }

    const clearButton = document.querySelector('[data-action="clear"]');
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            clear();
            updateDisplay();
        });
    }

    const deleteButton = document.querySelector('[data-action="delete"]');
    if (deleteButton) {
        deleteButton.addEventListener('click', () => {
            deleteNumber();
            updateDisplay();
        });
    }

    updateDisplay();
});
