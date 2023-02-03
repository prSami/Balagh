const knex = require("knex");
const connectedKnex =
knex({
    client:"sqlite3",
    connection:{
        filename: "leap.sqlite3"
    }
});
module.exports = connectedKnex;