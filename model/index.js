const Sequelize = require("sequelize");
const {
    MYSQL_DB_NAME,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_HOST,
    MYSQL_DIALECT,
} = require("../config/config");

const sequelize = new Sequelize(MYSQL_DB_NAME, MYSQL_USER, MYSQL_PASSWORD, {
    host: MYSQL_HOST,
    dialect: MYSQL_DIALECT,
});

const User = require("./user")(sequelize, Sequelize);
const Item = require("./items")(sequelize, Sequelize);
const Bid = require("./bid")(sequelize, Sequelize);

Item.hasMany(Bid, { foreignKey: "itemId" });
Bid.belongsTo(Item, { foreignKey: "itemId" });

sequelize.sync();

module.exports = { User, Item, Bid, sequelize };
