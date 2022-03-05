module.exports = {
    category: 'Minecraft',
    description: 'request a pseudo to be whitelisted on a minecraft server',
    slash: true,
    expectedArgs: '<Pseudonyme_Minecraft>',
    minArgs: 1,
    maxArgs: 1,
    syntaxError: 'syntaxe invalide merci de respecter la syntaxe /minecraft {PSEUDONYME}',

    callback: ({interaction, user, args, client, guild}) => {
        const Mojang = require('mojang-promise-api');
        const api = new Mojang();
        const Logger = require("../Utils/logger");
        const logger = new Logger.Logger;
        const sqlite = require("sqlite3")
        const config = require('../config.json')
        const username = args[0];
        let exists = false;
        api.nameToUuid(username)
            .then(async res => {
                // Yet another bad username handler
                if (res.length === 0) throw "Undefined username";

                // Only CR guild
                if (guild.id !== config.GUILD_ID) throw "Bad Server";

                // Minecraft claim channel only
                if (interaction.channel.id !== config.CHANNEL_CLAIM_ID) throw "Bad Channel";

                let db = new sqlite.Database('./clubRezo.db', (err) => {
                    if (err) {
                        throw "Database Error";
                    }
                    console.log('Connected to the database');
                });

                exists = await new Promise(res => {
                    db.all("SELECT Discord_ID FROM Minecraft_Queue", [], (err, rows) => {
                        if (err) console.log(err)
                        rows.forEach((row) => {
                            if (row.Discord_ID === user.id) {
                                res(true);
                            }
                        })
                        res(false);
                    })
                })

                if (exists) throw "User Already Exists";

                exists = await new Promise(res => {
                    db.all("SELECT Minecraft_Username FROM Minecraft_Queue WHERE Minecraft_Username = ?", [username], (err, rows) => {
                        if (err) console.log(err)
                        res(rows.length > 0)
                    })
                })

                if (exists) throw "Username Already Exists";

                const reply = `le pseudo: "${username}" à été mis en file d'attente. Tu recevras un mp lorsqu'il sera activé !`;
                interaction.reply({
                    content: reply,
                    ephemeral: true
                })

                // admin channel only
                let message = await client.channels.cache.get(config.CHANNEL_ADMIN_ID).send(`Le pseudo: "**${username}**" à été mis en file d'attente par **${user.tag}**`)

                db.run(`INSERT INTO Minecraft_Queue(Discord_ID, Minecraft_Username, Whitelisted, Message_ID)
                        VALUES (?, ?, ?, ?)`, [user.id, username, 0, message.id], (err) => {
                    if (err) console.log(err)
                });

                db.close();

                logger.info(username + " a été  mis en liste d'attente par " + user.tag)
            })
            .catch(err => {
                logger.error("/minecraft " + err + " - " + user.tag + " - mc username : " + username)
                let reply = 'Une erreur est survenue ! Contact un membre du staff';
                if (err === 'Bad Channel') reply = "Tu dois envoyer le message dans ce channel : https://discord.gg/dnUDCtkrm2";
                else if (err === 'Bad Server') reply = "Tu dois envoyer ce message dans ce serveur :  https://discord.gg/dnUDCtkrm2"
                else if (err === 'Undefined username') reply = `Aouch, ce pseudo semble invalide merci de verifier la syntaxe de celui-ci --- **${username}**`
                else if (err === 'User Already Exists') reply = `Tu as déjà un compte ! Contact un admin en cas de problème.`
                else if (err === 'Username Already Exists') reply = `Ce compte est déjà ajouté ! Contact un admin en cas de problème.`
                interaction.reply({
                    content: reply,
                    ephemeral: true
                })
            })
    }
}
