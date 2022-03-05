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
        const username = args[0];
        api.nameToUuid(username)
            .then(res => {
                // Yet another bad username handler
                if (res.length === 0) throw "Undefined username"

                // CR id == 236463158435381248
                if (guild.id !== '826575187721322546') throw "Bad Server"

                // Minecraft claim id = 949715227728019476
                if (interaction.channel.id !== '885808444064538645') throw "Bad Channel"

                // const sqlite = require('sqlite');
                // let db = new sqlite.Database('../clubRezo.db', sqlite.OPEN_READWRITE, (err) => {
                //     if (err) {
                //         console.log(`${config.BOT_PROPERTIES.CONSOLE_ERROR} (${err})`);
                //     }
                //     console.log('Connected to the database');
                // });
                // db.run(`INSERT INTO WhitelistQueue(pseudoDicord) VALUES(${user.tag})`);
                // console.log(`${config.BOT_PROPERTIES.CONSOLE_INFO} dicord tag added`);
                // db.run(`INSERT INTO WhitelistQueue(pseudoMinecraft) VALUES(${username})`);
                // console.log(`${config.BOT_PROPERTIES.CONSOLE_INFO} minecraft tag added`);
                // db.run(`INSERT INTO WhitelistQueue(serveur) VALUES(${args[1]})`);
                // console.log(`${config.BOT_PROPERTIES.CONSOLE_INFO} serveur tag added`);
                // db.close();

                const reply = `le pseudo: "${username}" à été mis en file d'attente. Tu recevras un mp lorsqu'il sera activé !`;
                interaction.reply({
                    content: reply,
                    ephemeral: true
                })

                // admin channel id = 949677843212795964
                client.channels.cache.get('797867131436793887').send(`Le pseudo: "**${username}**" à été mis en file d'attente par **${user.tag}**`)
                logger.info(username + " a été  mis en liste d'attente par " + user.tag)
            })
            .catch(err => {
                logger.error("/minecraft " + err + " - " + user.tag + " - mc username : " + username)
                let reply = 'Une erreur est survenue ! Contact un membre du staff';
                if (err === 'Bad Channel') reply = "Tu dois envoyer le message dans ce channel : https://discord.gg/dnUDCtkrm2";
                else if (err === 'Bad Server') reply = "Tu dois envoyer ce message dans ce serveur :  https://discord.gg/dnUDCtkrm2"
                else if (err === 'Undefined username') reply = `Aouch, ce pseudo semble invalide merci de verifier la syntaxe de celui-ci --- ${username}`
                interaction.reply({
                    content: reply,
                    ephemeral: true
                })
            })
    }
}
