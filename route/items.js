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

// Adjusted the route to make it unique and more descriptive
router.get("/not-sold/seller/:seller", getItemsBySellerAndNotSold);

// Adjusted the route to make it unique and more descriptive
router.get("/sold/seller/:seller", getItemsBySellerAndSold);

// Adjusted the route to make it unique and more descriptive
router.get("/id/:id", getItem);

router.get("/", getAllItems);

module.exports = router;
