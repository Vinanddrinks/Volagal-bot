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
            const reply = `le pseudo: "${pseudo}" à été mis en file d'attente tu recevras un mp lorsqu'il sera whitelisté`;
            console.log(`${config.BOT_PROPERTIES.CONSOLE_INFO} on the request of ${user.tag} the pseudo: ${pseudo} has been added to whitelisting queue`),
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