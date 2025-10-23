// Get references to DOM elements
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
const clearBtn = document.getElementById('clear');
const equalsBtn = document.getElementById('equals');

let currentInput = '';
let lastInput = '';
let operators = ['+', '-', '*', '/'];

//Function to update the display
function updateDisplay(value) {
    display.value = value;
}

//Function to append value to current input
function appendValue(value) {
    //Prevent multiple operators in a row
    if (operators.includes(value)) {
        if (currentInput === '' && value !== '-') {
            //Prevent operator at start except minus for negative numbers
            return;
        }
        if (operators.includes(lastInput)) {
            //Replace last operator with new one
            currentInput = currentInput.slice(0, -1);
        }
    }

    //Prevent multiple decimals in one number
    if (value === '.') {
        //Find last number segment
        const parts = currentInput.split(/[\+\-\*\/]/);
        const lastNumber = parts[parts.length - 1];
        if (lastNumber.includes('.')) {
            return;
        }
        if (lastNumber === '') {
            //If decimal is first in number, prepend 0
            value = '0.';
        }
    }

    currentInput += value;
    lastInput = value;
    updateDisplay(currentInput);
}

//Function to clear the display and input
function clearDisplay() {
    currentInput = '';
    lastInput = '';
    updateDisplay('0');
}

//Function to calculate the result
function calculate() {
    if (currentInput === '') return;

    //Prevent expression ending with operator
    if (operators.includes(lastInput)) {
        currentInput = currentInput.slice(0, -1);
    }

    try {
        /*Evaluate expression safely
        Using Function constructor instead of eval for safety
        Also replace division symbol ÷ with /      */
        let expression = currentInput.replace(/÷/g, '/');

        // Evaluate expression
        let result = Function('"use strict";return (' + expression + ')')();

        // Handle division by zero and invalid results
        if (result === Infinity || result === -Infinity) {
            updateDisplay('Error: Division by zero');
            currentInput = '';
            lastInput = '';
            return;
        }
        if (isNaN(result)) {
            updateDisplay('Error');
            currentInput = '';
            lastInput = '';
            return;
        }

        // Round result to 10 decimal places to avoid floating point issues
        result = Math.round((result + Number.EPSILON) * 1e10) / 1e10;

        updateDisplay(result.toString());
        currentInput = result.toString();
        lastInput = '';
    } catch (error) {
        updateDisplay('Error');
        currentInput = '';
        lastInput = '';
    }
}

// Event listeners for buttons
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.getAttribute('data-value');

        if (button.id === 'clear') {
            clearDisplay();
        } else if (button.id === 'equals') {
            calculate();
        } else {
            appendValue(value);
        }
    });
});

// Keyboard input handling
document.addEventListener('keydown', (event) => {
    const key = event.key;

    if ((key >= '0' && key <= '9') || key === '.') {
        appendValue(key);
    } else if (operators.includes(key)) {
        appendValue(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Backspace') {
        // Remove last character
        currentInput = currentInput.slice(0, -1);
        lastInput = currentInput.slice(-1);
        updateDisplay(currentInput || '0');
    } else if (key.toLowerCase() === 'c') {
        clearDisplay();
    }
});