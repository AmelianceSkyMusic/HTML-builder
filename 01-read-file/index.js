const path = require('path');

const fs = require('fs');

const textFielPath = path.join(__dirname, 'text.txt');

// fs.readFile(textFielPath, 'utf-8', (err, data) => {
//   if (err) throw new Error(err);
//   console.log(data);
// });

const readableStream =  fs.createReadStream(textFielPath, 'utf-8');
let data = '';
readableStream.on('data', chunk => data += chunk);
readableStream.on('end', () => console.log(data));
readableStream.on('error', error => console.log('ERROR: →', error.message, '←'));
