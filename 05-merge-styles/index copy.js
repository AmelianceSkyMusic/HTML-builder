// RUN: node 05-merge-styles

const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const util = require('util');
const stream = require('stream');
const { log } = require('console');
const pipeline = util.promisify(stream.pipeline);


async function makeBundleCSSS(dirPath, banleFilePath) {
  const dirListNames = await fsPromises.readdir(dirPath);
  fs.createWriteStream(banleFilePath).close(); // clean file

  const dirListPaths = dirListNames.map(elem => path.join(dirPath, elem)).reverse();

  const writeFile = async (filePath) => {
    const stats = await fsPromises.stat(filePath);
    const promise = await new Promise((resolve) => {

      const fileSize = stats.size;

      const readStream = fs.createReadStream(filePath, 'utf-8');
      const fileWriteStream = fs.createWriteStream(banleFilePath, {flags: 'a'});
      let writeSize = 0;

      const runPipeline = async () => {
        readStream.on('open', () => console.log('Start read:', path.parse(filePath).base));
        readStream.on('data', (chunk) => {
          process.stdout.clearLine();
          process.stdout.cursorTo(0);
          writeSize += chunk.length;
          process.stdout.write(`${writeSize} / ${fileSize}`);
        });

        readStream.on('close', () => { process.stdout.write('\n');});
        fileWriteStream.on('close', () => {log('close write stream\n');});
        await pipeline (
          readStream,
          fileWriteStream)
          .catch(err => console.log(err));
      };

      if (stats.isFile() && path.parse(filePath).ext === '.css') {

        const result = runPipeline()
          .catch(err => console.log(err));
        resolve(result);
      } else {
        resolve('not css');
      }
    });
    return promise;
  };

  while (dirListPaths.length) {
    const filePath = dirListPaths.pop();
    await writeFile(filePath);
  }

  return;
}

const currentDid = path.join(__dirname, 'styles');
const targetFile = path.join(__dirname, 'project-dist', 'bundle.css');

makeBundleCSSS(currentDid, targetFile);





// // RUN: node 05-merge-styles

// const fs = require('fs');
// const fsPromises = require('fs/promises');
// const path = require('path');
// const { pipeline } = require('stream');


// async function makeBundleCSSS(dirPath, banleFilePath) {
//   const dirListNames = await fsPromises.readdir(dirPath);

//   const fileWriteStream = fs.createWriteStream(banleFilePath);

//   for  (const elem of dirListNames) {

//     const filePath = path.join(dirPath, elem);
//     const stats = await fsPromises.stat(filePath);

//     const fileSize = stats.size;
//     // const chunkSize = 65486;
//     // const chunksCount = Math.ceil(fileSize / chunkSize );
//     let writeSize = 0;

//     if (stats.isFile() && path.extname(elem) === '.css') {
//       const readStream = fs.createReadStream(filePath, 'utf-8');

//       readStream.on('open', () => console.log('START READ', elem, fileSize));

//       pipeline(readStream, fileWriteStream, (err) => {
//         if (err) console.log(err);
//         console.log('...writing...');
//       });

//       // readStream.on('data', (chunk) => {
//       //   process.stdout.clearLine();
//       //   process.stdout.cursorTo(0);
//       //   writeSize += chunk.length;
//       //   process.stdout.write(`${writeSize} / ${fileSize}`);
//       // });
//       fileWriteStream.on('drain', () => console.log('DONE'));
//     }
//   }

//   // console.log('DONE');
//   // ↑↑↑ должно вывести в самом конце, после всех обработок,
//   // но пока не получилось сделать, только одним костылем
//   // черер оборачивание фор ич в промис

//   return;
// }

// const currentDid = path.join(__dirname, 'styles');
// const targetFile = path.join(__dirname, 'project-dist', 'bundle.css');

// makeBundleCSSS(currentDid, targetFile);




















// // RUN: node 05-merge-styles

// const fs = require('fs');
// const fsPromises = require('fs/promises');
// const path = require('path');
// const { pipeline } = require('stream');


// async function makeBundleCSSS(dirPath, banleFilePath) {
//   const fileWriteStream = fs.createWriteStream(banleFilePath);
//   const dirListNames = await fsPromises.readdir(dirPath);
//   const actions = [];

//   dirListNames.map( (elem) => path.join(dirPath, elem))
//     .forEach((filePath) => {
//       // actions.push(
//       fsPromises.stat(filePath)
//         .then ((stats) => {
//           const readStream = fs.createReadStream(filePath, 'utf-8');
//           readStream.on('error', () => {console.log('error');});

//           if (stats.isFile() && path.parse(filePath).ext === '.css') {
//             console.log('...writing: ' + path.basename(filePath));

//             pipeline(readStream, fileWriteStream, (err) => {
//               if (err) console.log(err);
//               console.log('...writing end...');
//             });

//           }
//         });
//       // );
//     });


//   // await Promise.all(actions)
//   //   .then(() => (console.log('DONE')));

//   return;
// }

// makeBundleCSSS(path.join(__dirname, 'styles'), path.join(__dirname, 'project-dist', 'bundle.css'));











// // RUN: node 05-merge-styles

// const fs = require('fs');
// const fsPromises = require('fs/promises');
// const path = require('path');
// const { pipeline } = require('stream');


// async function makeBundleCSSS(dirPath, banleFilePath) {

//   try {
//     const fileWriteStream = fs.createWriteStream(banleFilePath);
//     const dirList = await fsPromises.readdir(dirPath);

//     const write = new Promise((resolve) => {

//       for(const elem of dirList) {

//         const filePath = path.join(dirPath, elem);

//         fsPromises.stat(filePath)
//           .then ((stats) => {
//             const readStream = fs.createReadStream(filePath, 'utf-8');
//             readStream.on('error', () => {console.log('error');});

//             if (stats.isFile() && path.extname(elem) === '.css') {
//               pipeline(readStream, fileWriteStream, (err) => {
//                 if (err) console.log(err);
//                 console.log('...writing...');
//                 resolve('DONE');
//               });
//             }
//           });
//       }

//     });

//     write.then((data) => {console.log(data);});

//   } catch (err) {
//     console.log(err);
//   }

//   return;
// }

// makeBundleCSSS(path.join(__dirname, 'styles'), path.join(__dirname, 'project-dist', 'bundle.css'));













// // RUN: node 05-merge-styles
// !DONT WORK!

// const fs = require('fs');
// const fsPromises = require('fs/promises');
// const path = require('path');
// const { pipeline } = require('stream');


// async function makeBundleCSSS(dirPath, banleFilePath) {

//   try {
//     const fileWriteStream = fs.createWriteStream(banleFilePath);
//     const dirList = await fsPromises.readdir(dirPath);

//     const write = new Promise((resolve) => {

//       dirList.forEach((elem) => {

//         const filePath = path.join(dirPath, elem);

//         fsPromises.stat(filePath)
//           .then ((stats) => {
//             const readStream = fs.createReadStream(filePath, 'utf-8');
//             readStream.on('error', () => {console.log('error');});

//             if (stats.isFile() && path.extname(elem) === '.css') {
//               pipeline(readStream, fileWriteStream, (err) => {
//                 if (err) console.log(err);
//                 console.log('...writing...');
//               }).finally(() => {
//                 resolve('done');
//               });
//             }
//           });

//       });

//     });

//     write.then((data) => {console.log(data);});

//   } catch (err) {
//     console.log(err);
//   }

//   return;
// }

// makeBundleCSSS(path.join(__dirname, 'styles'), path.join(__dirname, 'project-dist', 'bundle.css'));

















// // RUN: node 05-merge-styles
// !DONT GOOD!

// const fs = require('fs');
// const fsPromises = require('fs/promises');
// const path = require('path');
// const { pipeline } = require('stream');

// async function makeBundleCSSS(dirPath, banleFilePath) {
//   await fsPromises.readdir(dirPath)
//     .then( (data) => {
//       const fileWriteStream = fs.createWriteStream(banleFilePath);
//       for (const elem of data) {
//         const filePath = path.join(dirPath, elem);
//         fsPromises.stat(filePath)
//           .then((stats) => {
//             const readStream = fs.createReadStream(filePath, 'utf-8');
//             readStream.on('error', () => {console.log('error');});
//             if (stats.isFile() && path.extname(elem) === '.css') {
//             //   readStream.pipe(fileWriteStream);
//               pipeline(readStream, fileWriteStream, (err) => {
//                 if (err) console.log(err);
//                 console.log('...writing...');
//               });
//             }
//           });
//       }
//     })
//     .catch((err) => {console.log('Opss! Here is an Error 00003:', err);})
//     .finally(() => {console.log('...done...');});
//   return;
// }

// makeBundleCSSS(path.join(__dirname, 'styles'), path.join(__dirname, 'project-dist', 'bundle.css'));
















// // RUN: node 05-merge-styles
// !DONT GOOD!

// const fs = require('fs');
// const fsPromises = require('fs/promises');
// const path = require('path');
// const { pipeline } = require('stream');

// async function makeBundleCSSS(dirPath, banleFilePath) {
//   await fsPromises.readdir(dirPath)
//     .then( (data) => {
//       const fileWriteStream = fs.createWriteStream(banleFilePath);
//       for (const elem of data) {
//         const filePath = path.join(dirPath, elem);
//         fsPromises.stat(filePath)
//           .then((stats) => {
//             const readStream = fs.createReadStream(filePath, 'utf-8');
//             readStream.on('error', () => {console.log('error');});
//             if (stats.isFile() && path.extname(elem) === '.css') {
//             //   readStream.pipe(fileWriteStream);
//               pipeline(readStream, fileWriteStream, (err) => {
//                 if (err) console.log(err);
//                 console.log('...writing...');
//               });
//             }
//           });
//       }
//       console.log('DONE');
//     })
//     .then(() => {console.log('DONE');})
//     .catch((err) => {console.log('Opss! Here is an Error 00003:', err);});
//   return;
// }

// makeBundleCSSS(path.join(__dirname, 'styles'), path.join(__dirname, 'project-dist', 'bundle.css'));
