const express = require("express");
const router = express.Router();
router.get("/", (req,res)=>{
    res.send("This is from the productRoutes.js file")
});

module.exports = router;
