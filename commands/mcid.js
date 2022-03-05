module.exports = {
    category: 'Minecraft',
    description: 'give the uuid of a minecraft user',
    slash: true,
    expectedArgs: '<pseudonyme>',
    minArgs: 1,
    maxArgs: 1,
    syntaxError: 'syntaxe invalide merci de respecter la syntaxe /mcid {ARGUMENTS}',

    callback: ({interaction, args, user}) => {
        const Mojang = require('mojang-promise-api');
        const config = require("../config.json")
        const pseudo = args[0]
        const api = new Mojang()
        api.nameToUuid(pseudo)
            .then(res => {
                const reply = `The Uuid of ${pseudo} is: ${res[0].id}`;
                console.log(`${config.BOT_PROPERTIES.CONSOLE_INFO} ${user.tag} used mcid on ${pseudo} it gave out ${res[0].id}`)
                interaction.reply({
                    content: reply
                })
            })
            .catch(err => {
                const reply = "il y a eu une erreur dans la requette api, verifier le pseudo"
                console.log(`${config.BOT_PROPERTIES.CONSOLE_WARN} ${user.tag} used mcid on ${pseudo} and there was a mojang api related error, it's usually due to unknown pseudo`),
                    console.log(`${config.BOT_PROPERTIES.CONSOLE_ERROR} (${err})`);
                interaction.reply({
                    content: reply
                })
            })
    }
}
