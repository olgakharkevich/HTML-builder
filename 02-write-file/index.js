const fs = require('fs');
const path = require('path');
const { stdin, stdout } = require('process');
const readline = require('readline');

const exitFn = () => {
    stdout.write(`\n`);
    stdout.write(`Your text was written in ${pathToFile}`);
    process.exit();
}

stdout.write('Please, write your text here \n');

const pathToFile = path.join(__dirname, '/text.txt');

const writeableStream = fs.createWriteStream(pathToFile, 'utf8');

const rl = readline.createInterface(stdin, writeableStream);

rl.on('line', (line) => {
    if (line === 'exit') {
        exitFn();
    } else {
        writeableStream.write(`${line}\n`);
    }
});

rl.on('error', (err) => stdout.write(err));

process.on('SIGINT', exitFn);
