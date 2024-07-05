const Sequelize = require("sequelize");
const config = require("../config/config.json")["development"];

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: config.dialect,
    }
);

const User = require("./user")(sequelize, Sequelize);
const Item = require("./items")(sequelize, Sequelize);
const Bid = require("./bid")(sequelize, Sequelize);

Item.hasMany(Bid, { foreignKey: "itemId" });
Bid.belongsTo(Item, { foreignKey: "itemId" });

sequelize.sync();

module.exports = { User, Item, Bid, sequelize };
