module.exports = {
    category: 'Minecraft',
    description: 'request a pseudo to be whitelisted on a minecraft server',
    slash:true,
    expectedArgs:'<Pseudonyme_Minecraft>',
    minArgs:1,
    maxArgs:1,
    syntaxError: 'syntaxe invalide merci de respecter la syntaxe /whitelist {ARGUMENTS}',
    callback:({interaction,user,args})=>{
        const Mojang = require('mojang-promise-api');
        const api = new Mojang();
        const config = require('../config.json');
        const pseudo = args[0];
        api.nameToUuid(pseudo)
        .then(res =>{
            const sqlite = require('sqlite');
            let db = new sqlite.Database('../clubRezo.db', sqlite.OPEN_READWRITE, (err) =>{
                if (err){
                    console.log(`${config.BOT_PROPERTIES.CONSOLE_ERROR} (${err})`);
                }
                console.log('Connected to the database');
            });
            db.run(`INSERT INTO WhitelistQueue(pseudoDicord) VALUES(${user.tag})`);
            console.log(`${config.BOT_PROPERTIES.CONSOLE_INFO} dicord tag added`);
            db.run(`INSERT INTO WhitelistQueue(pseudoMinecraft) VALUES(${pseudo})`);
            console.log(`${config.BOT_PROPERTIES.CONSOLE_INFO} minecraft tag added`);
            db.run(`INSERT INTO WhitelistQueue(serveur) VALUES(${args[1]})`);
            console.log(`${config.BOT_PROPERTIES.CONSOLE_INFO} serveur tag added`);
            db.close();
            const reply = `le pseudo: "${pseudo}" à été mis en file d'attente tu recevras un mp lorsqu'il sera whitelisté`;
            console.log(`${config.BOT_PROPERTIES.CONSOLE_INFO} on the request of ${user.tag} the pseudo: ${pseudo} has been added to ${args[1]}'s whitelisting queue`),
            interaction.reply({
                content: reply
            })
        })
        .catch(err =>{
            const reply = "Aouch, ce pseudo semble invalide merci de verifier la syntaxe de celui-ci"
            console.log(`${config.BOT_PROPERTIES.CONSOLE_WARN} ${user.tag} used whitelist on ${pseudo} and there was a mojang api related error, it's usually due to unknown pseudo`),
            console.log(`${config.BOT_PROPERTIES.CONSOLE_ERROR} (${err})`),
            console.log(`${config.BOT_PROPERTIES.CONSOLE_INFO} there was no append to whitelist queue`);
            interaction.reply({
                content: reply
            })
        })
        



    }

}