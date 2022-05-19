// RUN: node 03-files-in-folder

const path = require('path');

const fs = require('fs');

const fsPromises = require('fs/promises');

const directory = fsPromises.readdir(path.join(__dirname, 'secret-folder'));
directory
  .then( (data) =>
    console.log(data)
  );
