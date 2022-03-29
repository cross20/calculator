/**
 * The calculator element.
 */
const calculator = document.querySelector('form');

// TODO: implement more restrictions on these properties and when/how they can be set to avoid accidental or unauthorized changes. Ideally, these should only be able to be changed through a single function.
/**
 * @type {Array.<string|number>} History of the values input into the calculator since the last "final calculation".
 */
let input;

/**
 * @type {number} Index of the current value in the `input` array.
 */
let inputUBound;

/**
 * @type {boolean} Whether current value should be kept or overwritten when a number is input into the calculator.
 */
let keepInput;

/**
 * @type {boolean} representing whether numbers input into the calculator should be treated as decimals or integers.
 */
let isDecimalMode;

/**
 * @type {number} Number of decimal places in the current value.
 */
let decimalPlaces;

/**
 * @type {number} Sign of the current value (-1 or 1).
 */
let sign;

/**
 * Initializes the values used by the calculator to track the current state.
 * @param {Array.<string|number>} defaultInput default value for `input`.
 * @param {number} defaultInputUBound default value for `inputUBound`.
 * @param {boolean} defaultKeepInput default value for `keepInput`.
 * @param {boolean} defaultIsDecimalMode default value for `isDecimalMode`.
 * @param {number} defaultDecimalPlaces default value for `decimalPlaces`.
 * @param {number} defaultSign default value for `defaultSign`.
 */
function initializeValues(defaultInput = [null], defaultInputUBound = 0, defaultKeepInput = true, defaultIsDecimalMode = false, defaultDecimalPlaces = 0, defaultSign = 1) {
    input = defaultInput;
    inputUBound = defaultInputUBound;
    keepInput = defaultKeepInput;
    isDecimalMode = defaultIsDecimalMode;
    decimalPlaces = defaultDecimalPlaces;
    sign = defaultSign;
}

initializeValues();

/**
 * A mathematical operator.
 */
class Operator {
    /**
     * Creates a mathematical operator.
     * @param {string} operator Symbol representing an operator.
     * @param {boolean} isFinal Whether the operator results in the final calculation (e.g. equals) or additional calculations can occur after the result is calculated (e.g. multiply).
     */
    constructor(operator, isFinal) {
        this.operator = operator;
        this.isFinal = isFinal;
    }

    /**
     * String represention of the operator.
     */
    toString() {
        return this.operator;
    }
}

/**
 * All supported Operator objects.
 */
const supportedOperators = {
    // TODO: restrict these to constants if possible.

    /** Addition */
    add: new Operator("+", false),
    /** Subtraction */
    subtract: new Operator("-", false),
    /** Multiplication */
    multiply: new Operator("*", false),
    /** Division */
    divide: new Operator("/", false),
    /** Equals */
    equals: new Operator("=", true)
}

/**
 * Returns a Boolean value that indicates whether an object is a supported Operator or not.
 * @param {Operator} operator an Operator object.
 */
function isNaO(operator) {
    return Object.values(supportedOperators).indexOf(operator) < 0;
}

calculator.addEventListener('submit', (e) => {
    e.preventDefault();
});

// Reset to the default values when the calculator reset event is triggered.
calculator.addEventListener('reset', () => {
    initializeValues();
    output.value = '0';
});

/**
 * The output element for the calculator containing the result of any input or calculations.
 */
 const output = calculator.querySelector('output');
 output.value = '0';

/**
 * The number inputs for the calculator.
 */
const numbers = calculator.querySelectorAll('fieldset[name="numbers"] button');

numbers.forEach((number) => {
    // Add an event listener to each button to calculate the new value.
    number.addEventListener('click', (e) => {
        evaluateInputNumber(Number(e.target.value));
    });
});

/**
 * Evaluates the number input into the calculator and updates the output to reflect the result.
 * @param {number} number Integer value from 0 to 9 input into the calculator.
 * @returns {number} The current input value of the calculator.
 */
function evaluateInputNumber(number) {
    // Validate the values used during the calculation.
    if(isNaN(number)) {
        throw new Error(`Invalid number '${e.target.value}' input into calculator`);
    }

    if(number < 0 || number > 9 || Math.round(number) !== number) {
        throw new Error(`Unexpected number '${number}' input into calculator`);
    }

    if(decimalPlaces < 0) {
        throw new Error(`Unexpected number of decimal places '${decimalPlaces}'`);
    }

    if(!(sign === -1 || sign === 1)) {
        throw new Error(`Unexpected sign '${sign}'`);
    }

    // If the calculator is in decmimal mode, increment the number of decimal places every time a number is input.
    decimalPlaces += isDecimalMode;

    // If the calculator is not in decimal mode, shift all values to the left by one place. Also, overwrite the current value if the previous operator was equals.
    input[inputUBound] *= (10 / Math.pow(10, isDecimalMode)) * keepInput;

    // Convert the input number to the appropriate number of decimal places and add it to (or subtract it from) the current value.
    input[inputUBound] += (number / Math.pow(10, decimalPlaces)) * sign;

    // Correct imprecision caused by floating-point values. Without this, expressions such as 0.1 plus 0.2 would not equal 0.3.
    input[inputUBound] = parseFloat(input[inputUBound].toFixed(decimalPlaces));

    if(isNaN(input[inputUBound])) {
        throw new Error(`Error evaluating input for ${input[inputUBound]}`);
    }

    keepInput = true;

    output.value = input[inputUBound];

    return input[inputUBound]
}

/**
 * The modifier inputs for the calculator.
 */
const modifiers = calculator.querySelector('fieldset[name="modifiers"]');

/**
 * The button to toggle between positive and negative on the calculator.
 */
const positiveNegate = modifiers.querySelector('.positive-negative');
positiveNegate.addEventListener('click', () => {
    sign = -1;
    input[inputUBound] *= sign;
    output.value = input[inputUBound];
});

/**
 * The button to start inputing decimals rather than integers.
 */
const decimal = modifiers.querySelector('.decimal');
decimal.addEventListener('click', () => {
    isDecimalMode = true;
});

/**
 * The operator inputs for the calculator that trigger an evaluation of the current expression.
 */
const operators = calculator.querySelectorAll('fieldset[name="operators"] button');
operators.forEach((operator) => {
    operator.addEventListener('click', () => {
        evaluateExpression(supportedOperators[operator.value]);
    });
});

/**
 * Evaluates the current expression and updates the output to reflect the result.
 * @param {Operator} currentOperator Operator that triggered the evaluation.
 * @returns {number} The current result of the expression.
 */
function evaluateExpression(currentOperator) {
    if(isNaO(currentOperator)) {
        throw new Error(`Attempting to evaluate unsupported operator '${inputOperator}'`);
    }

    // Record that the operator was input.
    input[++inputUBound] = currentOperator;
    input[++inputUBound] = null;

    // Calculate the result.
    let result = input[0];
    for(let i = 1; i <= inputUBound - 2; i += 2) {
        const operator = input[i];
        if(isNaO(operator)) {
            throw new Error(`Input at '${i}' contains invalid operator '${operator}'`);
        }

        const number = input[i + 1];
        if(isNaN(number)) {
            throw new Error(`Input at '${i + 1}' contains invalid number '${number}'`);
        }

        const expression = `${result} ${operator.operator} ${number}`;
        // TODO: evaluate security implications of using Function.
        result = Function(`"use strict"; return(${expression})`)();

        if(isNaN(result)) {
            throw new Error(`Failed to evaluate expression '${expression}`);
        }
    }

    // Update the output to reflect the result of the calculation.
    output.value = result;

    // Reset the input properties.
    let tempInput;
    let tempInputUBound;

    if(currentOperator.isFinal) {
        tempInput = [result];
        tempInputUBound = 0;
    } else {
        tempInput = input;
        tempInputUBound = inputUBound;
    }

    initializeValues(tempInput, tempInputUBound, !currentOperator.isFinal);

    return result;
}