module.exports = {
    category: 'invitation',
    description: 'give the invite link of Volabot',
    slash:true,
    callback: ({ interaction }) => {
      const reply = 'https://discord.com/api/oauth2/authorize?client_id=946800896338182204&permissions=8&scope=applications.commands%20bot'
      interaction.reply({
          content:reply
      })
    },
}


