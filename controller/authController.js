const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../model");
const { ErrorResponse } = require("../utils");

const register = async (req, res) => {
    const { username, password } = req.body;

    const existingUser = await User.findOne({
        where: {
            username,
        },
    });

    if (existingUser) {
        ErrorResponse.error = {
            explanation: "User already registered",
        };
        return res.status(404).json(ErrorResponse);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    res.json({
        username: user.username,
        token,
    });
};

const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.json({ username: user.username, token });
};

module.exports = { register, login };
