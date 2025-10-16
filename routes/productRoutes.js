const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { uploadCsv } = require("../controllers/productController");


const upload = multer({
  dest: path.join(__dirname, "../uploads"),
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv" || file.originalname.match(/\.csv$/i)) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files allowed"), false);
    }
  },
});

router.post("/upload", upload.single("file"), (req, res)=>uploadCsv(req,res));


module.exports = router;
