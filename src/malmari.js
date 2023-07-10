// import env variables
import dotenv from 'dotenv'
dotenv.config()

// import client
import client from './client.js'

// import chat
import chat from './chat.js'

// malmari code
;(async () => {
  try {
    client.login(process.env.TOKEN)
    console.log('malmari logged in')
  } catch (error) {
    console.log(`Login ERR: ${error}`)
  }
})()

client.on('messageCreate', chat)
