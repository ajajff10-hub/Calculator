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
    if (num2 === 0) {
        return "ERROR: Nice try!";
    }
    return num1 / num2;
}

function operate(num1, operator, num2) {
    num1 = Number(num1);
    num2 = Number(num2);

    switch (operator) {
        case '+':
            return add(num1, num2);
        case '-':
            return subtract(num1, num2);
        case '*':
            return multiply(num1, num2);
        case '/':
            return divide(num1, num2);
        default:
            return "Invalid Operator";
    }
}
operate('+', 5, 3); 
operate('*', 4, 3); 
operate('/', 10, 0);
