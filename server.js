const http = require("http");
const socketIo = require("socket.io");
const {
    handleBid,
    getHighestBid,
    checkItemSold,
} = require("./controller/bidController");
const app = require("./app");
const { sequelize, Bid } = require("./model");
const authorize = require("./middleware/socketAuthMiddleware");
const fs = require("fs");
const path = require("path");
const { CLIENT_URL } = require("./config/config");
const cors = require("cors");

const server = http.createServer(app);

const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(cors());
app.options("*", cors());

const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

const auctionNamespace = io.of("/auction");

auctionNamespace.on("connection", async (socket) => {
    console.log("New client connected");

    socket.on("joinItemRoom", (itemId) => {
        socket.join(itemId);
        console.log(`Client joined room for item ${itemId}`);
    });

    socket.on("leaveItemRoom", (itemId) => {
        socket.leave(itemId);
        console.log(`Client left room for item ${itemId}`);
    });

    socket.on("getHighestBid", async (itemId) => {
        try {
            const highestBid = await getHighestBid(itemId);
            console.log("🚀 ~ socket.on ~ highestBid:", highestBid);
            if (!highestBid) {
                const message = {
                    itemId: itemId,
                    message: "No bids placed yet.",
                };
                auctionNamespace.to(itemId).emit("highestBid", message);
                return;
            }
            auctionNamespace.to(itemId).emit("highestBid", highestBid);
        } catch (error) {
            console.error("Error fetching highest bid:", error);
            auctionNamespace.to(itemId).emit("highestBidError", {
                itemId: itemId,
                message: "Error fetching highest bid.",
            });
        }
    });

    socket.on("bid", async (bid) => {
        try {
            const check = await checkItemSold(bid.itemId);
            if (check) {
                auctionNamespace
                    .to(bid.itemId)
                    .emit("itemSold", "Item already sold");
                throw new Error("Item already sold");
            }
            const newBid = await handleBid(bid);
            auctionNamespace.to(bid.itemId).emit("bid", newBid);

            const highestBid = await getHighestBid(bid.itemId);
            console.log("🚀 ~ socket.on ~ highestBid:", highestBid);
            auctionNamespace.to(bid.itemId).emit("highestBid", highestBid);
        } catch (error) {
            console.error("Error handling bid:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await sequelize.authenticate();
    console.log("Database connected!");
});
