// RUN: node 04-copy-directory

const fsPromises = require('fs/promises');
const path = require('path');

async function copyDir (dirPath, copiedDirPath) {
  const dir = path.basename(dirPath);
  const parentDir = path.dirname(dirPath);

  if (!copiedDirPath) copiedDirPath = path.resolve(parentDir, dir + '-copy');

  await fsPromises.rm(copiedDirPath,  {recursive: true, force: true})
    .catch(() => {});

  await fsPromises.mkdir(copiedDirPath, {recursive: true})
    .catch((err) => {console.log('Opss! Here is an Error 00002:', err);});

  await fsPromises.readdir(dirPath)
    .then( (data) => {
      for (const elem of data) {
        const oldFilePath = path.join(dirPath, elem);
        const newFilePath = path.join(copiedDirPath, elem);
        fsPromises.stat(oldFilePath)
          .then((stats) => {
            if (!stats.isFile()) {
              console.log('FOLDER:', path.parse(elem).base);
              copyDir(oldFilePath, newFilePath);
            } else {
              console.log('-', path.parse(elem).base);
              fsPromises.copyFile(oldFilePath, newFilePath);
            }
          });
      }
    })
    .catch((err) => {console.log('Opss! Here is an Error 00003:', err);});
  return;
}

copyDir(path.join(__dirname, 'files'), path.join(__dirname, '..', 'FOLDER'));
