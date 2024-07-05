const express = require("express");
const {
    createItem,
    getAllItems,
    upload,
    getItem,
} = require("../controller/itemController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, upload.single("image"), createItem);
router.get("/", getAllItems);
router.get("/:id", getItem);

module.exports = router;
