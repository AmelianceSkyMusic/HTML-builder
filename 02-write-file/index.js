// RUN: node 02-write-file

const process = require('process');
const {stdin, exit} = require('process');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const fileWriteStream = fs.createWriteStream(filePath, 'utf-8');

console.log('\n-----------------------------------\n! H e l l o ,  M y  S t u d e n t !\n-----------------------------------\n\nPlease, enter your passwords:');
stdin.on('data', (message) => {
  const msg = message.toString().replace('\n', '').replace('\r', '');
  if (msg === 'exit') exit();
  fileWriteStream.write(message.toString());
});

process.on('exit', () => {
  fileWriteStream.end();
  console.log('\n---------------------------------------\n! G o o d b y e ,  M y  S t u d e n t !\n---------------------------------------\n');
});


process.on('SIGINT', () => exit());
