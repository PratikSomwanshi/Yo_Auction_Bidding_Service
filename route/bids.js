const express = require("express");
const {
    handleBid,
    getHighestBid,
    closeBidding,
} = require("../controller/bidController");
const router = express.Router();

router.post("/", handleBid);
router.get("/highest/:itemId", getHighestBid);
router.post("/closebid/:itemId", closeBidding);

module.exports = router;
