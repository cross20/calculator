const calculator = document.querySelector('form');

let input = [null];
let inputUBound = 0;
let result = null;

class Operator {
    /**
     * @param {string} operator The mathematical operator.
     * @param {boolean} saveResult Whether the result should be saved or not when the operator invokes the evaluation of an expression.
     */
    constructor(operator, saveResult) {
        this.operator = operator;
        this.saveResult = saveResult;
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
    // TODO: DRY
    input = 0;
    result = null;
});

const output = calculator.querySelector('output');

const numbers = calculator.querySelectorAll('fieldset[name="numbers"] button');
const modifiers = calculator.querySelector('fieldset[name="modifiers"]');
const operators = calculator.querySelector('fieldset[name="operators"]');

numbers.forEach((number) => {
    number.addEventListener('click', (e) => {
        const number = Number(e.target.value);

        if(isNaN(number)) {
            throw new Error(`Invalid number '${e.target.value}' input into calculator`);
        }

        if(number < 0 || number > 9) {
            throw new Error(`Unexpected number '${number}' input into calculator`);
        }

        input[inputUBound] *= 10;
        input[inputUBound] += number;
        if(isNaN(input[inputUBound])) {
            throw new Error(`Error evaluating input for ${input[inputUBound]}`);
        }

        console.log(`Input is now ${input}`);
        output.value = input[inputUBound];
    });
});

/**
 * Evaluates the expression and updates the output to reflect the result.
 * @param {string} currentOperator Operator that triggered the evaluation.
 */
function evaluateExpression(currentOperator) {
    if(isNaO(currentOperator)) {
        throw new Error(`Attempting to evaluate unsupported operator '${inputOperator}'`);
    }

    input[++inputUBound] = currentOperator;
    input[++inputUBound] = null;
    console.log(`Input is now ${input}`);

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
        result = Function(`"use strict"; return(${expression})`)();

        if(isNaN(result)) {
            throw new Error(`Failed to evaluate expression '${expression}`);
        }
    }

    output.value = result;

    // TODO: reset after equals.
}

const add = operators.querySelector('.add');
add.addEventListener('click', () => {
    evaluateExpression(supportedOperators.add);
});

const subtract = operators.querySelector('.subtract');
subtract.addEventListener('click', () => {
    evaluateExpression(supportedOperators.subtract);
});

const multiply = operators.querySelector('.multiply');
multiply.addEventListener('click', () => {
    evaluateExpression(supportedOperators.multiply);
});

const divide = operators.querySelector('.divide');
divide.addEventListener('click', () => {
    evaluateExpression(supportedOperators.divide);
});

const equals = operators.querySelector('.equals');
equals.addEventListener('click', () => {
    evaluateExpression(supportedOperators.equals);
});

// TODO: implement modifiers.