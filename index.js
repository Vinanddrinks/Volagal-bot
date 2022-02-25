const Discord = require("discord.js")
const client = new Discord.client()

client.on("ready", () =>{
    console.log(`Logged in Discord as ${client.user.tag}`)
})
client.login(process.env.TOKEN)