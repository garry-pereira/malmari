import context from './context.js'
import openai from './openai.js'

const chat = async (message) => {
  const { client } = message
  if (message.author.bot) return
  if (message.channel.id !== process.env.CHAT_CHANNEL_ID) return
  if (message.content.startsWith('$')) return

  let conversationLog = [{ role: 'system', content: context }]

  try {
    await message.channel.sendTyping()

    let prevMessages = await message.channel.messages.fetch({ limit: 6 })
    prevMessages.reverse()

    prevMessages.forEach((msg) => {
      if (msg.content.startsWith('$')) return
      if (msg.author.id !== client.user.id && message.author.bot) return

      conversationLog.push({
        role: 'user',
        content: msg.content,
      })
    })

    const result = await openai
      .createChatCompletion({
        model: 'gpt-4',
        messages: conversationLog,
      })
      .catch((error) => {
        console.log(`OPENAI ERR: ${error}`)
      })

    // make everything lowercase
    result.data.choices[0].message.content =
      result.data.choices[0].message.content.toLowerCase()

    message.reply(result.data.choices[0].message)
  } catch (error) {
    console.log(`Receiving message ERR: ${error}`)
  }
}

export default chat
