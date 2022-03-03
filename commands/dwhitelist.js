module.exports = {
    category:'Minecraft',
    description:'whitelist a pseudo using rcon on the server directly',
    slash:true,
    expectedArgs:'<Pseudonyme_Minecraft> <Serveur>',
    minArgs:2,
    maxArgs:2,
    syntaxError: 'syntaxe invalide merci de respecter la syntaxe /dwhitelist {ARGUMENTS}',
    permissions:['ADMINISTRATOR'],
    callback: ({ interaction,user,args,guild })  => {
        const Rcon = require('simple-rcon');
        const Mojang = require('mojang-promise-api');
        const config = require('../config.json');
        const servers = require('../server.json');
            let api = new Mojang();
            api.nameToUuid(args[0])
            .then(res =>{
                if(args[1] == "Vanilla"){
                    var mconsole = new Rcon({
                        host: servers.Vanilla.IP,
                        port: servers.Vanilla.PORT,
                        password: servers.Vanilla.Password,

                    }).exec('whitelist '+args[0],function(){
                        console.log(config.BOT_PROPERTIES.CONSOLE_INFO+' '+args[0]+' has been whitelisted on '+args[1]+' on demand of '+user.tag)
                        mconsole.close();
                    }).connect();
                    mconsole.on('authenticated', function() {
                        console.log('RCON VANILLA > Authenticated!');
                      }).on('connected', function() {
                        console.log('RCON VANILLA > Connected!');
                      }).on('disconnected', function() {
                        console.log('RCON VANILLA > Disconnected!');
                      });
                      interaction.reply({
                        content:'Success !'
                    })
                }else if(args[1] == "Moddé"){
                    var mconsole = new Rcon({
                        host: servers.Moddé.IP,
                        port: servers.Moddé.PORT,
                        password: servers.Moddé.Password,

                    }).exec('whitelist '+args[0],function(){
                        console.log(config.BOT_PROPERTIES.CONSOLE_INFO+' '+args[0]+' has been whitelisted on '+args[1]+' on demand of '+user.tag)
                        mconsole.close();
                    }).connect();
                    mconsole.on('authenticated', function() {
                        console.log('RCON VANILLA > Authenticated!');
                      }).on('connected', function() {
                        console.log('RCON VANILLA > Connected!');
                      }).on('disconnected', function() {
                        console.log('RCON VANILLA > Disconnected!');
                      });
                      
                      interaction.reply({
                          content:'Success !'
                      })
                }else{
                    console.log(`${config.BOT_PROPERTIES.CONSOLE_INFO} User: ${user.tag} tried to dwhitelist but provided an invalid server name`)
                    interaction.reply({
                        content:"Nom du serveur invalide !"
                    })
                }

            })
            .catch(err =>{
                console.log(`${config.BOT_PROPERTIES.CONSOLE_WARN} User : ${user.tag} tried to dwhitelist but the pseudo is unknown`)
                console.log(`${config.BOT_PROPERTIES.CONSOLE_ERROR} ${err}`)
                interaction.reply({
                    content:"Pseudo incorrect !"
                })
            })

    },


}
