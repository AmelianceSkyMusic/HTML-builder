// Если интересно можете попробовать еще одну альтернативную форму для кроссчека
// https://discord.com/channels/516715744646660106/869435851187306556/978603167812046888

// RUN: node 01-read-file

const path = require('path');

const fs = require('fs');

const textFielPath = path.join(__dirname, 'text.txt');

const readableStream =  fs.createReadStream(textFielPath, 'utf-8');
let data = '';
readableStream.on('data', chunk => data += chunk);
readableStream.on('end', () => console.log(data));
readableStream.on('error', error => console.log('ERROR: →', error.message, '←'));
