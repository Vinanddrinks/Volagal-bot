const Rcon = require("simple-rcon");
const servers = require("../servers.json");
const config = require("../config.json");
const Mojang = require("mojang-promise-api");
const sqlite = require("sqlite3");
module.exports = {
    category: 'Minecraft',
    description: 'ban a username using rcon on the server directly',
    slash: true,
    expectedArgs: '<Pseudo_Minecraft>',
    minArgs: 1,
    maxArgs: 1,
    syntaxError: 'syntaxe invalide merci de respecter la syntaxe /dwhitelist {ARGUMENTS}',

    callback: ({interaction, user, args, guild, client}) => {
        const Rcon = require('simple-rcon');
        const Mojang = require('mojang-promise-api');
        const servers = require('../servers.json');
        const Logger = require("../Utils/logger");
        const logger = new Logger.Logger;
        const sqlite = require("sqlite3")
        const config = require("../config.json")
        let admin, whitelisted = false;
        let username = user;
        if (args) {
            username = args[0];
        }
        try {
            const admins = guild.roles.cache.get(config.MODO_ROLE_ID).members.map(m => m.user.id)
            admin = admins.includes(user.id)
            admin = true
        } catch (e) {
            console.log("-> e", e);
        }

        if (admin) {
            let api = new Mojang();
            api.nameToUuid(username)
                .then(async res => {
                    // Yet another bad username handler
                    if (res.length === 0) throw "Undefined username"

                    // Only CR guild
                    if (guild.id !== config.GUILD_ID) throw "Bad Server"

                    let db = new sqlite.Database('./clubRezo.db', (err) => {
                        if (err) {
                            throw "Database Error";
                        }
                        console.log('Connected to the database');
                    });

                    whitelisted = await new Promise(res => {
                        db.all("SELECT Whitelisted FROM Minecraft_Queue WHERE Minecraft_Username = ?", [username], (err, rows) => {
                            if (err) console.log(err)
                            if (rows.length) res(rows[0].Whitelisted)
                            else res(-1)
                        })
                    })

                    if (whitelisted === 0) throw "Already Banned"
                    else if (whitelisted === -1) throw "User Not Found"

                    interaction.reply({
                        content: `[**${username}**] Waiting...`,
                        ephemeral: true
                    })

                    await new Promise(res => {
                        const mconsoleVanilla = new Rcon({
                            host: servers.vanilla.IP,
                            port: servers.vanilla.PORT,
                            password: servers.vanilla.Password,
                        }).exec('whitelist remove ' + username, () => {
                            logger.info(username + 'has been banned vanilla on demand of ' + user.tag)
                            mconsoleVanilla.close();
                        }).exec('ban ' + username, () => {
                            logger.info(username + 'has been banned mods on demand of ' + user.tag)
                            mconsoleMods.close();
                        }).connect();

                        mconsoleVanilla.on('authenticated', () => {
                            console.log('RCON VANILLA > Authenticated!');
                        }).on('connected', () => {
                            console.log('RCON VANILLA > Connected!');

                            db.run(`UPDATE Minecraft_Queue
                                    SET Whitelisted = ?
                                    WHERE Minecraft_Username = ?`, [0, username], (err) => {
                                if (err) console.log(err)
                            });
                            // interaction.channel.send({
                            //     content: `[**${username}**] Good Vanilla`,
                            //     ephemeral: true
                            // })

                        }).on('disconnected', () => {
                            console.log('RCON VANILLA > Disconnected!');
                        }).on('error', (e) => {
                            // interaction.channel.send({
                            //     content: `[**${username}**] Error Vanilla`,
                            //     ephemeral: true
                            // })
                            logger.error(e)
                        });

                        const mconsoleMods = new Rcon({
                            host: servers.mod.IP,
                            port: servers.mod.PORT,
                            password: servers.mod.Password,
                        }).exec('whitelist remove ' + username, () => {
                            logger.info(username + 'has been banned mods on demand of ' + user.tag)
                            mconsoleMods.close();
                        }).exec('ban ' + username, () => {
                            logger.info(username + 'has been banned mods on demand of ' + user.tag)
                            mconsoleMods.close();
                        }).connect();

                        mconsoleMods.on('authenticated', () => {
                            console.log('RCON VANILLA > Authenticated!');
                        }).on('connected', () => {
                            console.log('RCON VANILLA > Connected!');

                            db.run(`UPDATE Minecraft_Queue
                                    SET Whitelisted = ?
                                    WHERE Minecraft_Username = ?`, [0, username], (err) => {
                                if (err) console.log(err)
                            });
                            // interaction.channel.send({
                            //     content: `[**${username}**] Good Mods`,
                            //     ephemeral: true
                            // })

                        }).on('disconnected', () => {
                            console.log('RCON VANILLA > Disconnected!');
                        }).on('error', (e) => {
                            // interaction.channel.send({
                            //     content: `[**${username}**] Error Mods`,
                            //     ephemeral: true
                            // })
                            logger.error(e)
                        });

                        db.all(`SELECT Message_ID
                                FROM Minecraft_Queue
                                WHERE Minecraft_Username = ?`, [username], (err, rows) => {
                            if (err) console.log(err)

                            if (rows[0]) {
                                client.channels.cache.get(config.CHANNEL_ADMIN_ID).messages.fetch(rows[0].Message_ID).then(async (res) => {
                                    res.reactions.removeAll()
                                        .catch(error => console.error('Failed to clear reactions:', error));

                                    await res.react('???');
                                })
                            }
                        });

                        db.all(`SELECT Discord_ID
                                FROM Minecraft_Queue
                                WHERE Minecraft_Username = ?`, [username], (err, rows) => {
                            if (err) console.log(err)

                            if (rows[0]) {
                                client.users.cache.find(u => u.id === rows[0].Discord_ID).send({
                                    content: "Tu n'as plus acc??s aux serveurs du Club-R??zo, d??sol??.\n" +
                                        "Si tu penses qu'il s'agir d'une erreur, contact un modo minecraft."
                                })
                            }
                        });

                    })

                    db.close()

                    // TODO ajouter/retirer r??action message info admin

                })
                .catch(err => {
                    logger.error("/ban " + err + " - " + user.tag + " - mc username : " + username)
                    let reply = 'Une erreur est survenue ! Contact un membre du staff';
                    if (err === 'Bad Server') reply = "Tu dois envoyer ce message dans ce serveur :  https://discord.gg/dnUDCtkrm2"
                    else if (err === 'Undefined username') reply = `Aouch, ce pseudo semble invalide merci de verifier la syntaxe de celui-ci -> **${username}**`
                    else if (err === 'Already Banned') reply = `Ce pseudo est d??j?? exclu de la liste blanche -> **${username}**`
                    else if (err === 'User Not Found') reply = `Ce pseudo n'est pas sur notre liste -> **${username}**`
                    interaction.reply({
                        content: reply,
                        ephemeral: true
                    })
                })
        } else {
            interaction.reply({
                content: "Tu n'es pas habilit?? ?? utiliser cette fonction, d??sol?? :/"
            })
            logger.error("/ban " + user.tag + " - Forbidden")
        }
    },
}
