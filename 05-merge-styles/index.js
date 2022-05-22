// RUN: node 05-merge-styles

const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const { log } = require('console');
const { pipeline } = require('node:stream/promises');

async function makeBundleCSSS(dirPath, banleFilePath) {
  const dirListNames = await fsPromises.readdir(dirPath);
  fsPromises.unlink(banleFilePath).catch(() => {});

  for (const elem of dirListNames) {

    const filePath = path.join(dirPath, elem);
    const stats = await fsPromises.stat(filePath);
    const fileSize = stats.size;
    let writeSize = 0;

    if (stats.isFile() && path.parse(filePath).ext === '.css') {
      const readStream = fs.createReadStream(filePath, 'utf-8');
      const fileWriteStream = fs.createWriteStream(banleFilePath, {flags: 'a'});
      readStream.on('open', () => console.log('>> Start reading:', path.parse(filePath).base));
      readStream.on('close', () => console.log('   End reading'));
      readStream.on('data', (chunk) => {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        writeSize += chunk.length;
        process.stdout.write(`   ${writeSize} / ${fileSize}\n`);
      });

      fileWriteStream.on('open', () => {log('   Start writing');});
      fileWriteStream.on('close', () => {log('<< End writing\n');});

      await pipeline (
        readStream,
        fileWriteStream)
        .catch(err => console.log(err));
    }
  }
  log(`Created: ${path.parse(banleFilePath).base}`);
}

const currentDid = path.join(__dirname, 'styles');
const targetFile = path.join(__dirname, 'project-dist', 'bundle.css');

makeBundleCSSS(currentDid, targetFile);
