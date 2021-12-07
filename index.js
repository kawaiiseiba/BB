require('dotenv').config()
const Discord = require('discord.js')

const bb = new Discord.Client()
const mongoose = require('mongoose')

mongoose.connect(process.env.AkashicRecords, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true
})

const GAMES_EMOJI = require('./schemas/games_emoji')
const GAMES_VC = require('./schemas/games_voice')

const db = mongoose.connection
db.on('error', e => console.log({ message: e.message }))
db.on('open', async () => {
  const current = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
  console.log(`BB's connected to Master's data sets\nDate: ${current}`)
})

const updateBotStats = async presence => {
  const altria = bb.guilds.cache.get('848169570954641438')
  const member = altria.members.cache.get(presence.userID)
  const user = member.user
  const bot_status = member.presence.status !== `offline` ? `🔵` : `🔴`

  if(!user.bot) return 

  const vc_id = user.id === `881189615883669505` ? `912632157367828510` : // Luka
                user.id === `868813919177814036` ? `912632263110438993` : // Noelle
                user.id === `860402673635557376` ? `912632375899475998` : //Katheryne
                user.id === `873168515442573312` ? `912632497894998026` : // Meltryllis
                false

  if(!vc_id) return

  const bot_status_vc = altria.channels.cache.get(vc_id)
  await bot_status_vc.setName(`${bot_status}》${user.username}`)
  console.log(`${bot_status}》${user.username}`)
}

const resetBB = async () => {
  bb.destroy()
  bb.login()
}

const updateVcPositions = async id => {
  try{
    const altria = bb.guilds.cache.get('848169570954641438')
    const member = altria.members.cache.get(id)
    const voiceState = member.voice
    const presence = member.presence
    const user = member.user

    const games_vc = await GAMES_VC.find()

    if(user.bot) return

    if(!voiceState) return
    if(!voiceState.channel) return 

    const inFarSide = games_vc.find(data => data.vc === voiceState.channel.id)
    if(!inFarSide) return

    const activity = presence.activities.find(activity => activity.type === `PLAYING`)

    if(presence.activities.length < 1) {
      const lounge = games_vc[0]
      
      if(voiceState.channel.id === lounge.vc) return
      
      return await voiceState.setChannel(lounge.vc)
    }

    if(!activity) return

    const matched = games_vc.find(data => data.game === activity.name.toLowerCase())

    if(!matched || (matched.game === `league of legends` && activity.state !== `In Game`)) {
      const lounge = games_vc[0]
      if(voiceState.channel.id === lounge.vc) return

      return await voiceState.setChannel(lounge.vc)
    }

    return await voiceState.setChannel(matched.vc)
  } catch(e) {
    console.log(e)
    await resetBB(process.env.BB)
  }
}

bb.on(`ready`, async () => {
  // bb.user.setPresence({ 
  //   activity: { 
  //     name: "Testing",  
  //     type: "PLAYING" 
  //   },
  //   status: "invisible" 
  // })
  console.log(`Cute and ready for summons`)

  const altria = bb.guilds.cache.get('848169570954641438')

  const bots = [
    `881189615883669505`, // Luke
    `868813919177814036`, // Noelle
    `860402673635557376`, //Katheryne
    `873168515442573312`, // Meltryllis
  ]

  bots.map(async v => {
    const user = altria.members.cache.get(v)
    await updateBotStats(user.presence)
  })

  altria.channels.cache.get('913061856124469278').messages.fetch('913292251638140988')

  // const roles = [
  //   '909380401355718737',
  //   '909380210703618078',
  //   '909380571812216862',
  //   '909380766440501288',
  //   '909380988285616129',
  // ]

  // roles.map(async v => {
  //   const ROLES = altria.roles.cache.get(v)

  //   console.log(ROLES)
  // })

  // const games = [
  //   `895638285647495218`,
  //   `872048058966351913`,
  //   `872048059545169920`,
  //   `872048060002353152`,
  //   `872048058945376257`,
  // ]

  // GAMES_EMOJI.map(async v => {
  //   const channel = altria.channels.cache.get('913061856124469278')

  //   const roles_manager = await channel.messages.fetch('913292251638140988')

  //   await roles_manager.react(v.emoji)
  // })
})

bb.on(`voiceStateUpdate`, async (oldState, newState) => {
  if(oldState.channelID === newState.channelID) return
  return await updateVcPositions(newState.id)
})

bb.on(`presenceUpdate`, async (oldState, newState) => {
  await updateVcPositions(newState.userID)

  return await updateBotStats(newState)
})

bb.on('messageReactionAdd', async (reaction, user) => {
  let msg = reaction.message, emoji = reaction.emoji
  const GUILD = bb.guilds.cache.get('848169570954641438')

  if(msg.channel.id !== `913061856124469278`) return
  if(msg.author.bot) return

  if(msg.id !== `913292251638140988`) return

  const games_emoji = await GAMES_EMOJI.find()

  const matched = games_emoji.find(data => data.emoji === emoji.id)

  if(!matched) return reaction.users.remove(user.id)

  return GUILD.members.cache.get(user.id).roles.add(matched.role)
})

bb.on('messageReactionRemove', async (reaction, user) => {
  let msg = reaction.message, emoji = reaction.emoji
  const GUILD = bb.guilds.cache.get('848169570954641438')

  if(msg.channel.id !== `913061856124469278`) return
  if(msg.author.bot) return

  if(msg.id !== `913292251638140988`) return

  const games_emoji = await GAMES_EMOJI.find()

  const matched = games_emoji.find(data => data.emoji === emoji.id)

  if(!matched) return 

  return GUILD.members.cache.get(user.id).roles.remove(matched.role)
})

bb.login(process.env.BB)