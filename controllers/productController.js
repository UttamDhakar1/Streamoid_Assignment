
const uploadCsv = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = req.file.path;
  return res.json({
    "file path " : filePath,
    "message" : "Success"
  })
}

module.exports = { uploadCsv, 
};
