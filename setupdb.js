const sqlite = require('sqlite').verbose();
let db = new sqlite.Database('../clubRezo.db', (err) =>{
    if (err){
        console.log(`${config.BOT_PROPERTIES.CONSOLE_ERROR} (${err})`);
    }
    console.log('Connected to the database');
});