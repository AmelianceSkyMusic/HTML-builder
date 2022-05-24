// RUN: node 01-read-file

const path = require('path');

const fs = require('fs');

const textFielPath = path.join(__dirname, 'text.txt');

const readableStream =  fs.createReadStream(textFielPath, 'utf-8');
let data = '';
readableStream.on('data', chunk => data += chunk);
readableStream.on('end', () => console.log(data));
readableStream.on('error', error => console.log('ERROR: →', error.message, '←'));
