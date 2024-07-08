const { Bid, Item, User } = require("../model");
const Redis = require("ioredis");
const { ErrorResponse, SuccessResponse } = require("../utils");
const dotenv = require("dotenv");

dotenv.config();

const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
});

const checkItemSold = async (itemId) => {
    return await redisClient.get(`bid:${itemId}`, (error, value) => {
        if (!error) return value;
    });
};

const getAllBidsByUsername = async (req, res) => {
    const username = req.params.username;
    try {
        const user = await User.findOne({
            where: {
                username,
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const bids = await Bid.findAll({
            where: {
                username: username,
            },
        });

        if (!bids) {
            throw new Error("Bids not found");
        }

        SuccessResponse.data = bids;
        SuccessResponse.message = "successfully fetched all bids";
        return res.json(SuccessResponse);
    } catch (error) {
        console.error("Error fetching bids by username:", error);
        ErrorResponse.error = {
            explanation: error.message,
        };
    }
};

const handleBid = async (bid) => {
    const bidId = Date.now();
    await redisClient.set(
        `bid:${bid.itemId}:${bidId}`,
        JSON.stringify(bid),
        "EX",
        3600
    );

    return bid;
};

async function closeBidding(req, res) {
    const itemId = req.params.itemId;
    try {
        const highestBid = await closeBid(itemId);
        if (highestBid) {
            SuccessResponse.data = highestBid;
            SuccessResponse.message = "Bid closed successfully";

            await redisClient.set(
                `bid:${itemId}`,
                JSON.stringify({ status: "sold" }),
                "EX",
                3600
            );

            return res.status(200).json(SuccessResponse);
        } else {
            res.status(404).json({ message: "No bids found for this item" });
        }
    } catch (error) {
        ErrorResponse.error = {
            explanation: error.message,
        };

        res.status(500).json(ErrorResponse);
    }
}

const closeBid = async (itemId) => {
    try {
        const highestBid = await getHighestBid(itemId);
        console.log("🚀 ~ closeBid ~ highestBid:", highestBid);

        if (highestBid) {
            const item = await Item.findByPk(highestBid.itemId);
            if (!item) {
                throw new Error("Item not found");
            }
            await item.update({ status: "sold" });
            const keys = await redisClient.keys(`bid:${itemId}:*`);
            if (keys.length) {
                const pipeline = redisClient.pipeline();
                keys.forEach((key) => pipeline.del(key));
                await pipeline.exec();
            }

            // const itemId =;
            // console.log(typeof itemId, itemId);

            await Bid.create({
                amount: highestBid.amount,
                username: highestBid.userId,
                itemId: parseInt(highestBid.itemId),
            });

            // console.log(`Bid closed for item ${itemId} and highest bid saved`);
            return highestBid;
        } else {
            console.log(`No bids found for item ${itemId}.`);
            return null;
        }
    } catch (error) {
        console.error("Error closing bid:", error);
        throw error;
    }
};

const getHighestBid = async (itemId) => {
    console.log("🚀 ~ getHighestBid ~ itemId:", itemId);

    try {
        const keys = await redisClient.keys(`bid:${itemId}:*`);

        if (!keys.length) {
            return null;
        }

        const pipeline = redisClient.pipeline();
        keys.forEach((key) => {
            pipeline.get(key);
        });

        const results = await pipeline.exec();
        let highestBid = null;
        let highestAmount = 0;

        results.forEach((result) => {
            const bidData = result[1];
            const bid = JSON.parse(bidData);

            if (bid.amount > highestAmount) {
                highestAmount = bid.amount;
                highestBid = bid;
            }
        });

        console.log("highest bidding " + JSON.stringify(highestBid));

        return highestBid;
    } catch (error) {
        console.error("Error fetching highest bid from Redis:", error);
        throw error;
    }
};

module.exports = {
    getAllBidsByUsername,
    handleBid,
    getHighestBid,
    closeBidding,
    checkItemSold,
};
