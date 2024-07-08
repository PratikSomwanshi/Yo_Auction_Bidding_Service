const express = require("express");
const {
    createItem,
    getAllItems,
    upload,
    getItem,
    getItemsBySeller,
    getItemsBySellerAndSold,
    getItemsBySellerAndNotSold,
} = require("../controller/itemController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, upload.single("image"), createItem);
router.get("/", getAllItems);
router.get("/not/:seller", getItemsBySellerAndNotSold);
router.get("/:seller", getItemsBySellerAndSold);
router.get("/:id", getItem);

module.exports = router;
