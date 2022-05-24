// RUN: node 05-merge-styles

const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const { pipeline } = require('stream');


async function makeBundleCSSS(dirPath, banleFilePath) {
  const dirListNames = await fsPromises.readdir(dirPath);
  const fileWriteStream = fs.createWriteStream(banleFilePath);

  dirListNames.forEach(async (elem) => {

    const filePath = path.join(dirPath, elem);
    const stats = await fsPromises.stat(filePath);
    const fileSize = stats.size;

    if (stats.isFile() && path.extname(elem) === '.css') {

      const readStream = fs.createReadStream(filePath, 'utf-8');

      readStream.on('open', () => console.log('START READ', elem, fileSize));
      readStream.pipe(fileWriteStream);
      readStream.on('end', () => { console.log('DONE');});

    }
  });


  return;
}

const targetDid = path.join(__dirname, 'styles');
// const targetDid = path.join(__dirname, 'styles')

makeBundleCSSS(targetDid, path.join(__dirname, 'project-dist', 'bundle.css'));
