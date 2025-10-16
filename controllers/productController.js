const { parseCsvFile } = require("../utils/csvParser");

const uploadCsv = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = req.file.path;
  let rows;
  try {
    rows = await parseCsvFile(filePath, { skipLines: 0 });
  } catch (err) {
    // remove temp file
    fs.unlinkSync(filePath);
    return res.status(500).json({ error: "Failed to parse CSV", details: err.message });
  }

  return res.json({
    rows,
    filePath
  })
}

module.exports = { uploadCsv, 
};
