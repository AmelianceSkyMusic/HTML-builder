// RUN: node 03-files-in-folder

const path = require('path');

const fs = require('fs');

const fsPromises = require('fs/promises');

const directory = fsPromises.readdir(path.join(__dirname, 'secret-folder'));
directory
  .then( (data) => {
    // console.log(data);
    for (const elem of data) {
    //   console.log(elem);
      const filePath = path.join(__dirname, 'secret-folder', elem);
      fs.stat(filePath, (err, stats) => {
        if (err) console.log(err);
        if (stats.isFile()) {
          console.log(`${path.parse(elem).name} - ${path.extname(elem).replace('.', '')} - ${(stats.size/1024).toFixed(3)}kb`);
        }
      });
    //   fs.stat(path.join(__dirname, 'secret-folder', elem), stats => console.log(stats) );
    //   console.log(stat.isFile(path.join(__dirname, elem)));
    }
  });
