const Logger = require("./Utils/logger");
const logger = new Logger.Logger;

const sqlite = require('sqlite3').verbose();
let db = new sqlite.Database('./clubRezo.db', (err) => {
    if (err) {
        logger.error(err)
    }
    console.log('Connected to the database');
});

db.run("CREATE TABLE Minecraft_Queue(Discord_ID VARCHAR(255) PRIMARY KEY NOT NULL, Minecraft_Username VARCHAr(255) NOT NULL, Whitelisted BIT DEFAULT 0, Message_ID VARCHAR(255) NOT NULL)")
db.close()
