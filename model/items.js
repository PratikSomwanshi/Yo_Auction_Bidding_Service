const { StatusEnum } = require("../utils/enums/StatusEnum");

module.exports = (sequelize, DataTypes) => {
    const Item = sequelize.define("Item", {
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        imageUrl: DataTypes.JSON,
        initialAmount: DataTypes.INTEGER,
        seller: DataTypes.STRING,
        status: {
            type: DataTypes.ENUM,
            values: Object.values(StatusEnum),
        },
    });
    return Item;
};
