const discord = require('discord.js')
const WOKCommands = require('wokcommands')
const path = require('path')
const dotenv = require('dotenv')
const chalk = require('chalk')
const Logger = require("./Utils/logger");
const logger = new Logger.Logger;
const { Intents } = discord
const config = require("./config.json")

dotenv.config()

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
  logger.info(`Logged in Discord as ${client.user.tag}`)
  logger.info(`With User ID: ${client.user.id}`)
})

const TOKEN = (process.env.NODE_ENV === "dev") ? process.env.TOKEN_DEV : process.env.TOKEN_PROD;
if (typeof TOKEN !== "undefined") {
  client.login(TOKEN).then(() => {
    console.log(chalk.underline("\n\n -> Running ", process.env.NODE_ENV === 'dev' ?
        chalk.bgGreen('dev') : chalk.bgRed(process.env.NODE_ENV)), '\n')
  });
} else {
  console.log("No token found")
}
