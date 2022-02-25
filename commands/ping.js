module.exports = {
    category: 'Testing',
    description: 'Replies with pong',
    testOnly: true,
    callback: ({ message, interaction }) => {
      const reply = 'Pong!'
      if(message){
          message.reply({
              content:reply,
          })
        return
      }
    },
}