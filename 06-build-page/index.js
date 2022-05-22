// RUN: node 06-build-page

const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const { log } = require('console');
const { pipeline } = require('node:stream/promises');




// >----------------------------------------------------------------<
// >                         COMBINE HTML                           <
// >----------------------------------------------------------------<

async function combineHtml(dirPath) {
  log('Start creating');
  const projectDist = path.join(dirPath, 'project-dist');
  await fsPromises.rm(projectDist,  {recursive: true, force: true})
  // .then(() => {console.log('Old folder was removed');})
    .catch(() => {});
  await fsPromises.mkdir(projectDist, {recursive: true});
  const file = await fsPromises.readFile(path.join(dirPath, 'template.html'), 'utf8');
  const fileStrings = file.split('\n');

  for await (const string of fileStrings) {
    const found = string.match(/{{.+}}/gi);
    let line = string;

    if (found) {
      const htmlComponentPath = path.join(dirPath, 'components', `${found.toString().slice(2, -2)}.html`);
      const htmlComponent = await fsPromises.readFile(htmlComponentPath, 'utf8');
      line = htmlComponent;
    }

    fsPromises.appendFile(path.join(projectDist, 'index.html'), line);
  }

}




// >----------------------------------------------------------------<
// >                          COMBINE CSS                           <
// >----------------------------------------------------------------<

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
  log(`Created: ${path.parse(banleFilePath).base}\n-----------------------------`);
}



// >----------------------------------------------------------------<
// >                         COPY DIRECTORY                         <
// >----------------------------------------------------------------<

async function copyDir (dirPath, copiedDirPath) {
  const dir = path.basename(dirPath);
  const parentDir = path.dirname(dirPath);

  if (!copiedDirPath) copiedDirPath = path.resolve(parentDir, dir + '-copy');

  await fsPromises.rm(copiedDirPath,  {recursive: true, force: true})
  // .then(() => {console.log('Old folder was removed');})
    .catch(() => {});

  await fsPromises.mkdir(copiedDirPath, {recursive: true})
  // .then(() => {console.log('Folder was created');})
    .catch((err) => {console.log('Opss! Here is an Error 00002:', err);});

  await fsPromises.readdir(dirPath)
    .then( (data) => {
      for (const elem of data) {
        const oldFilePath = path.join(dirPath, elem);
        const newFilePath = path.join(copiedDirPath, elem);
        fsPromises.stat(oldFilePath)
          .then((stats) => {
            if (!stats.isFile()) {
              console.log('Copy folder:', path.parse(elem).base);
              copyDir(oldFilePath, newFilePath);
            } else {
              console.log('Copy file:', path.parse(elem).base);
              fsPromises.copyFile(oldFilePath, newFilePath);
            }
          });
      }
    })
  // .then(() => {console.log('Files was copied');})
    .catch((err) => {console.log('Opss! Here is an Error 00003:', err);});
  return;
}




// >----------------------------------------------------------------<
// >                         CREATE PROJECT                         <
// >----------------------------------------------------------------<

combineHtml(path.join(__dirname))
  .then(() => {

    const currentStyleDid = path.join(__dirname, 'styles');
    const targetStyleFile = path.join(__dirname, 'project-dist', 'style.css');

    makeBundleCSSS(currentStyleDid, targetStyleFile);
  })
  .then(() => {
    copyDir(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
  });
