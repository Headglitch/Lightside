const {Client} = require("discord.js");
const bot = new Client();
const {existsSync} = require("fs")
const owners = ["686825976998789121"]
let prefix = "gb!"
let active = new Map()

const blacklisted_users = ["", "", "", ""]

bot.login("Njg2ODQyMDg4NjgzMzM5Nzg2.XmdHjw.Hbt9x4e24IIjZVfCvrw7eh3YNac")
          
bot.on("ready", () => {
  console.log("I am online!\nLogged into: " + bot.user.tag)
  bot.generateInvite(8).then(i => console.log(i))
  bot.user.setActivity("watching 1M | gb!help", {type: "PLAYING"})
})

bot.on("message", async message => {

  
    if (message.author.bot || !message.content.startsWith(prefix)) return
    
    let args = message.content.slice(prefix.length).trim().split(/ +/g)
    let path = `./commands/${args.shift().toLowerCase()}.js`

    if(!existsSync(path)) return

    const exec = require(path)
    const run = () => exec.run(bot, message, args, active)

    if(!exec.ownerOnly) return run()

    if(exec.ownerOnly && owners.includes(message.author.id)) return run()
    else message.channel.send("That's only for owners.")
})


bot.on("messageDelete", (message) => {
  if(message.author.bot) return
  
  const path = __dirname + "/snipe.json"
  let snipeFile = require(path)
  
  if(message.attachments.first()){
    snipeFile[message.channel.id] = [message.author.tag, message.content, message.author.avatarURL, message.attachments.first().proxyURL]
  } else {
    snipeFile[message.channel.id] = [message.author.tag, message.content, message.author.avatarURL]
  }
  
  require("fs").writeFileSync(path, JSON.stringify(snipeFile, null, 2), error => {
    console.log(error)
  })
})


// Extra code (Do not touch!)

require("express")().get("/", (q, r) => r.sendFile(__dirname + "/index.html")).listen(1234)
setInterval(() => {require("https").get(`https://Lightside-bot.glitch.me`)}, 10000)