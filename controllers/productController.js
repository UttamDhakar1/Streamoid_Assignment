const { parseCsvFile } = require("../utils/csvParser");
const { validateProductRow } = require("../utils/validation")

const uploadCsv = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = req.file.path;
  let rows;
  try {
    rows = await parseCsvFile(filePath, { skipLines: 0 });
  } catch (err) {
    fs.unlinkSync(filePath);
    return res.status(500).json({ error: "Failed to parse CSV", details: err.message });
  }

  const valid = [];
  const invalid = [];

  rows.forEach((row, idx) => {
    const { valid: ok, value, errors } = validateProductRow(row);
    if (ok) {
      valid.push(value);
    } else {
      invalid.push({
        row: idx + 1,
        original: row,
        errors,
      });
    }
  });

  return res.json({
    rows,
    filePath,
    valid,
    invalid
  })
}

module.exports = { uploadCsv, 
};
