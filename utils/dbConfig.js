
const mysql = require("mysql2/promise")


let conn = {
    multipleStatements: global.config.multipleStatements,
    host: global.config.host,
    user: global.config.user,
    password: global.config.password,
    database: global.config.database,
}

const pool = mysql.createPool(conn);

pool.getConnection()
    .then(conn => {
        console.log(`Database connected successfully in ${mode} mode!`);
        conn.release();
    })
    .catch(err => {
        console.error(`Database not connected in ${mode} mode:`, err);
    });


module.exports = pool






