const fs = require('fs');
const path = require('path');

const base64Encode = (file) => {
  const bitmap = fs.readFileSync(file);

  return Buffer.from(bitmap).toString('base64');
};

const base64Decode = (base64str, file) => {
  const bitmap = Buffer.from(base64str, 'base64');

  fs.writeFileSync(file, bitmap);
};

module.exports = {
  base64Decode,
  base64Encode,
  exits: (filePath) => fs.existsSync(filePath),
  getExtension: (filePath) => path.extname(filePath),
  getFileName: (filePath) => path.basename(filePath),
  getFilesFolder: () => `${process.cwd()}/files/`,
};
