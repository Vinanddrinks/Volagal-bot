module.exports = {
    category:'Minecraft',
    description:'whitelist a pseudo using rcon on the server directly',
    slash:true,
    expectedArgs:'<Pseudonyme_Minecraft> <Serveur>',
    minArgs:2,
    maxArgs:2,
    syntaxError: 'syntaxe invalide merci de respecter la syntaxe /dwhitelist {ARGUMENTS}',
    callback: ({ interaction })  => {
        const Rcon = require('rcon');
    },


}