module.exports = {
    category: 'Testing',
    description: 'Replies with pong',
    slash:true,
    callback: ({ interaction }) => {
      const reply = 'Pong!'
      interaction.reply({
          content:reply
      })
    },
}