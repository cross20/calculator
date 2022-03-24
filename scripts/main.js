const calculator = document.querySelector('form');

let input, inputUBound, overwriteInput, result;

function initializeValues() {
    input = [null];
    inputUBound = 0;
    overwriteInput = false;
    result = null;
}

initializeValues();

class Operator {
    /**
     * @param {string} operator Symbol representing a mathematical operator.
     * @param {boolean} isFinal Whether the result is considered final when calculating the expression for this operator.
     */
    constructor(operator, isFinal) {
        this.operator = operator;
        this.isFinal = isFinal;
    }

    toString() {
        return this.operator;
    }
}

const supportedOperators = {
    add: new Operator("+", false),
    subtract: new Operator("-", false),
    multiply: new Operator("*", false),
    divide: new Operator("/", false),
    equals: new Operator("=", true)
}

/**
 * Returns a Boolean value that indicates whether an object is a supported Operator.
 * @param {Operator} operator an Operator object.
 */
function isNaO(operator) {
    return Object.values(supportedOperators).indexOf(operator) < 0;
}

calculator.addEventListener('submit', (e) => {
    e.preventDefault();
});

calculator.addEventListener('reset', () => {
    initializeValues();
});

const output = calculator.querySelector('output');

const numbers = calculator.querySelectorAll('fieldset[name="numbers"] button');

numbers.forEach((number) => {
    number.addEventListener('click', (e) => {
        const number = Number(e.target.value);

        if(isNaN(number)) {
            throw new Error(`Invalid number '${e.target.value}' input into calculator`);
        }

        if(number < 0 || number > 9) {
            throw new Error(`Unexpected number '${number}' input into calculator`);
        }

        input[inputUBound] *= 10 * !overwriteInput;
        input[inputUBound] += number;
        if(isNaN(input[inputUBound])) {
            throw new Error(`Error evaluating input for ${input[inputUBound]}`);
        }

        overwriteInput = false;

        output.value = input[inputUBound];
    });
});

const modifiers = calculator.querySelector('fieldset[name="modifiers"]');
// TODO: implement modifiers.

const operators = calculator.querySelectorAll('fieldset[name="operators"] button');
operators.forEach((operator) => {
    operator.addEventListener('click', () => {
        evaluateExpression(supportedOperators[operator.value]);
    });
});

/**
 * Evaluates the expression and updates the output to reflect the result.
 * @param {Operator} currentOperator Operator that triggered the evaluation.
 */
function evaluateExpression(currentOperator) {
    if(isNaO(currentOperator)) {
        throw new Error(`Attempting to evaluate unsupported operator '${inputOperator}'`);
    }

    input[++inputUBound] = currentOperator;
    input[++inputUBound] = null;

    // Calculate the result.
    result = input[0];
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

    output.value = result;

    overwriteInput = currentOperator.isFinal;
    if(overwriteInput) {
        input = [result];
        inputUBound = 0;
    }
}