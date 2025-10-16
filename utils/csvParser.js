
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

function parseCsvFile(filePath, options = {}) {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv({
        mapHeaders: ({ header }) => header.trim(),
        skipLines: 0,
        ...options,
      }))
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

module.exports = {
  parseCsvFile,
};
