const Rcon = require("simple-rcon");
const servers = require("../servers.json");
const config = require("../config.json");
const Mojang = require("mojang-promise-api");
module.exports = {
    category: 'Minecraft',
    description: 'whitelist a username using rcon on the server directly',
    slash: true,
    expectedArgs: '<Pseudo_Minecraft>',
    minArgs: 1,
    maxArgs: 1,
    syntaxError: 'syntaxe invalide merci de respecter la syntaxe /dwhitelist {ARGUMENTS}',

    callback: ({interaction, user, args, guild}) => {
        const Rcon = require('simple-rcon');
        const Mojang = require('mojang-promise-api');
        const config = require('../config.json');
        const servers = require('../servers.json');
        const Logger = require("../Utils/logger");
        const logger = new Logger.Logger;
        let admin = false;
        let username = user
        if (args) {
            username = args[0];
        }

        try {
            const admins = guild.roles.cache.get('236565289855090688').members.map(m => m.user.id)
            admin = admins.includes(user.id)
        } catch (e) {
            console.log("-> e", e);
        }

        if (admin) {
            let api = new Mojang();
            api.nameToUuid(username)
                .then(res => {
                    // Yet another bad username handler
                    if (res.length === 0) throw "Undefined username"

                    // CR id == 236463158435381248
                    if (guild.id !== '826575187721322546') throw "Bad Server"

                    interaction.reply({
                        content: `Waiting...`
                    })

                    const mconsoleVanilla = new Rcon({
                        host: servers.vanilla.IP,
                        port: servers.vanilla.PORT,
                        password: servers.vanilla.Password,
                    }).exec('whitelist ' + username, () => {
                        console.log(config.BOT_PROPERTIES.CONSOLE_INFO + ' ' + username + ' has been whitelisted on ' + args[1] + ' on demand of ' + user.tag)
                        mconsoleVanilla.close();
                    }).connect();

                    mconsoleVanilla.on('authenticated', () => {
                        console.log('RCON VANILLA > Authenticated!');
                    }).on('connected', () => {
                        console.log('RCON VANILLA > Connected!');
                        interaction.channel.send({
                            content: "Good Vanilla"
                        })
                    }).on('disconnected', () => {
                        console.log('RCON VANILLA > Disconnected!');
                    }).on('error', (e) => {
                        console.log("-> Vanilla", e);
                        interaction.channel.send({
                            content: "Error Vanilla"
                        })
                    });

                    const mconsoleMods = new Rcon({
                        host: servers.mod.IP,
                        port: servers.mod.PORT,
                        password: servers.mod.Password,
                    }).exec('whitelist ' + username, () => {
                        console.log(config.BOT_PROPERTIES.CONSOLE_INFO + ' ' + username + ' has been whitelisted on ' + args[1] + ' on demand of ' + user.tag)
                        mconsoleMods.close();
                    }).connect();

                    mconsoleMods.on('authenticated', () => {
                        console.log('RCON VANILLA > Authenticated!');
                    }).on('connected', () => {
                        console.log('RCON VANILLA > Connected!');
                        interaction.channel.send({
                            content: "Good Mods"
                        })
                    }).on('disconnected', () => {
                        console.log('RCON VANILLA > Disconnected!');
                    }).on('error', (e) => {
                        console.log("-> Mods", e);
                        interaction.channel.send({
                            content: "Error Mods"
                        })
                    });

                })
                .catch(err => {
                    console.log("-> err", err);
                    if (err === "Bad Server") {
                        console.log(`${config.BOT_PROPERTIES.CONSOLE_WARN} User : ${user.tag} tried to whitelist in an unknown server`)
                        console.log(`${config.BOT_PROPERTIES.CONSOLE_ERROR} ${err}`)
                        interaction.channel.send({
                            content: "Bad Server !"
                        })
                    } else {
                        console.log(`${config.BOT_PROPERTIES.CONSOLE_WARN} User : ${user.tag} tried to whitelist but the username is unknown`)
                        console.log(`${config.BOT_PROPERTIES.CONSOLE_ERROR} ${err}`)
                        interaction.channel.send({
                            content: "username incorrect !"
                        })
                    }
                })
        } else {
            interaction.reply({
                content: "Tu n'es pas habilité à utiliser cette fonction, désolé :/"
            })
        }


    },
}
