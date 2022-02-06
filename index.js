import input from 'input';
import fs from 'fs';

const calculations = {};

async function askQuestion() {
    while(true) {
        const question = (await input.text('What is your question?', { default: '1+1' })).replace(/\s/g, '');

        if (calculations[question] !== undefined) {
            console.log(question + "=" + calculations[question])
        } else {
            let operation;
            let operand;

            if (question.includes('+')) {
                operation = (num1, num2) => num1 + num2;
                operand = '+';
            } else if (question.includes('-')) {
                operation = (num1, num2) => num1 - num2;
                operand = '-';
            } else if (question.includes('/')) {
                operation = (num1, num2) => num1 / num2;
                operand = '/'
            } else if (question.includes('*')) {
                operation = (num1, num2) => num1 * num2;
                operand = '*'
            }

            const [num1, num2] = question.split(operand).map(x => parseInt(x, 10));

            if (!question || !operand || isNaN(num1) || isNaN(num2)) {
                console.log("You did not ask a valid question! Please try again.")
            } else {
                let answer = operation(num1, num2);

                var code = fs.readFileSync('index.js').toString().replace(/\r/g, '').split("\n");

                let answers = JSON.parse(code[3].replace('const calculations = ', '').replace(';', ''));

                answers[question] = answer;

                code[3] = 'const calculations = ' + JSON.stringify(answers) + ';'

                fs.writeFileSync('index.js', code.join("\r\n"))

                console.log(question + "=" + answer + " (I have now put this in \"storage\"!)")

                calculations[question] = answer;
            }

            
        }
        
    }
}

askQuestion();