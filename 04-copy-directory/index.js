// RUN: node 04-copy-directory

const fsPromises = require('fs/promises');
const path = require('path');

async function copyDir (dirPath) {
  const dir = path.basename(dirPath);
  const parentDir = path.dirname(dirPath);
  const copiedDirPath = path.resolve(parentDir, dir + '-copy');

  //   await fsPromises.access(copiedDirPath, true)
  //   await fsPromises.stat(copiedDirPath)
  //     .then(
  await fsPromises.rm(copiedDirPath,  {recursive: true})
    .then(() => {console.log('Old folder was removed');})
    .catch(() => {console.log('Folder doesn\'t exist!');});

  await fsPromises.mkdir(copiedDirPath, {recursive: true})
    .then(() => {console.log('Folder was created');})
    .catch((err) => {console.log('Opss! Here is an Error 00002:', err);});

  await fsPromises.readdir(dirPath)
    .then( (data) => {
    //   console.log(data);
      for (const elem of data) {
        // console.log(elem);
        fsPromises.copyFile(path.join(dirPath, elem), path.join(copiedDirPath, elem));
      }
    })
    .then(() => {console.log('Files was copied');})
    .catch((err) => {console.log('Opss! Here is an Error 00003:', err);});
}

copyDir(path.join(__dirname, 'files'));
