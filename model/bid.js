module.exports = (sequelize, DataTypes) => {
    const Bid = sequelize.define("Bid", {
        amount: DataTypes.FLOAT,
        username: DataTypes.STRING,
        itemId: DataTypes.INTEGER,
    });
    return Bid;
};
