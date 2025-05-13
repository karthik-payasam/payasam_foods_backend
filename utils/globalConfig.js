require('dotenv').config()

//mode = "local";
mode = "staging";

config = {};

if (mode === "staging") {
    config.user = process.env.staging_user,
        config.host = process.env.staging_host,
        config.password = process.env.staging_password,
        config.database = process.env.staging_database,
        config.multipleStatements = process.env.staging_multipleStatements,
        config.sceret_key = process.env.staging_sceret_key
}
else if (mode === "local") {
    config.user = process.env.local_user;
    config.host = process.env.local_host;
    config.password = process.env.local_password;
    config.database = process.env.local_database;
    config.multipleStatements = process.env.local_multipleStatements;
    config.secret_key = process.env.local_secret_key;
}