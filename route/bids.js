const express = require("express");
const {
    handleBid,
    getHighestBid,
    closeBidding,
    getAllBidsByUsername,
} = require("../controller/bidController");
const router = express.Router();

router.post("/", handleBid);
router.get("/highest/:itemId", getHighestBid);
router.post("/closebid/:itemId", closeBidding);
router.get("/:username", getAllBidsByUsername);

module.exports = router;
