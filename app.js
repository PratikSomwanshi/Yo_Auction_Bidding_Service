const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./route/auth");
const itemRoutes = require("./route/items");
const bidRoutes = require("./route/bids");
const morgan = require("morgan");
const { CLIENT_URL } = require("./config/config");

dotenv.config();

const app = express();

const corsOptions = {
    origin: CLIENT_URL,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(morgan(":method :url :status :response-time ms :date[web]"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRoutes);
app.use("/items", itemRoutes);
app.use("/bids", bidRoutes);
app.use("/uploads", express.static("uploads"));

module.exports = app;
