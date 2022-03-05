const discord = require('discord.js')
const WOKCommands = require('wokcommands')
const path = require('path')

const { Intents } = discord
const config = require("./config.json")
const client = new discord.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
})

client.on('ready', () => {
  // client.application.commands.fetch()
  //     .then(commands => console.log(commands.forEach(command => command.delete()), `Fetched ${commands.size} commands`))
  //     .catch(console.error);
  new WOKCommands(client, {
    // The name of the local folder for your command files
    commandsDir: path.join(__dirname, 'commands'),
  })
  .setDefaultPrefix('!')
  console.log(`${config.BOT_PROPERTIES.CONSOLE_INFO} Logged in Discord as ${client.user.tag}`)
  console.log(`${config.BOT_PROPERTIES.CONSOLE_INFO} With User ID: ${client.user.id}`)
})

client.login(config.BOT_PROPERTIES.TOKEN)
