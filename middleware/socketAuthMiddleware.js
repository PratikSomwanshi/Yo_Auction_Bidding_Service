const jwt = require("jsonwebtoken");

const authorize = (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        const err = new Error("Authentication error");
        err.data = { content: "Please provide a valid token" };
        return next(err);
    }

    jwt.verify(token, "your_jwt_secret", (err, decoded) => {
        if (err) {
            const err = new Error("Authentication error");
            err.data = { content: "Token is not valid" };
            return next(err);
        }

        socket.user = decoded;
        next();
    });
};

module.exports = authorize;
