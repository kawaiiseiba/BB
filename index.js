require('dotenv').config()
const Discord = require('discord.js')

const bb = new Discord.Client()

const GAMES_VC = [
  {
    gameVc: {
      name: `lounge`, 
      vcId: `909067741288341564`
    }
  },
  {
    gameVc: {
      name: `axie infinity`,
      vcId: `914338740732854342`
    }
  },
  {
    gameVc: {
      name: `genshin impact`,
      vcId: `909068725024600175`
    }
  },
  {
    gameVc: {
      name: `league of legends`,
      vcId: `908986448076734484`
    }
  },
  {
    gameVc: {
      name: `left 4 dead`,
      vcId: `909379903860928542`
    }
  },
  {
    gameVc: {
      name: `phasmophobia`,
      vcId: `909379998677336134`
    }
  },
  {
    gameVc: {
      name: `valorant`,
      vcId: `909065684246470707`
    }
  },
  {
    gameVc: {
      name: `visual studio code`,
      vcId: `881441102253674547`
    }
  }
]

const GAMES_EMOJI = [
  {
    emoji: `895638285647495218`,
    role: `909380401355718737`
  },
  {
    emoji: `872048058966351913`,
    role: `909380210703618078`
  },
  {
    emoji: `872048059545169920`,
    role: `909380571812216862`
  },
  {
    emoji: `872048060002353152`,
    role: `909380766440501288`
  },
  {
    emoji: `872048058945376257`,
    role: `909380988285616129`
  },
]

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

const updateVcPositions = async id => {
  const altria = bb.guilds.cache.get('848169570954641438')
  const member = altria.members.cache.get(id)
  const voiceState = member.voice
  const presence = member.presence
  const user = member.user

  if(user.bot) return

  if(!voiceState) return
  if(!voiceState.channel) return 

  const inFarSide = GAMES_VC.find(data => data.gameVc.vcId === voiceState.channel.id)
  console.log(inFarSide)
  if(!inFarSide) return

  const activity = presence.activities.find(activity => activity.type === `PLAYING`)

  if(presence.activities.length < 1) {
    const lounge = GAMES_VC[0].gameVc.vcId
    
    if(voiceState.channel.id === lounge) return

    return await voiceState.setChannel(lounge)
  }

  if(!activity) return

  const matched = GAMES_VC.find(data => data.gameVc.name === activity.name.toLowerCase())

  if(!matched || (matched.gameVc.name === `league of legends` && activity.state !== `In Game`)) {
    const lounge = GAMES_VC[0].gameVc.vcId
    if(voiceState.channel.id === lounge) return

    return await voiceState.setChannel(lounge)
  }

  return await voiceState.setChannel(matched.gameVc.vcId)
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

  // games.map(async v => {
  //   const channel = altria.channels.cache.get('913061856124469278')

  //   const roles_manager = await channel.messages.fetch('913292251638140988')

  //   await roles_manager.react(v)
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

  const matched = GAMES_EMOJI.find(data => data.emoji === emoji.id)

  if(!matched) return reaction.users.remove(user.id)

  return GUILD.members.cache.get(user.id).roles.add(matched.role)
})

bb.on('messageReactionRemove', async (reaction, user) => {
  let msg = reaction.message, emoji = reaction.emoji
  const GUILD = bb.guilds.cache.get('848169570954641438')

  if(msg.channel.id !== `913061856124469278`) return
  if(msg.author.bot) return

  if(msg.id !== `913292251638140988`) return

  const matched = GAMES_EMOJI.find(data => data.emoji === emoji.id)

  if(!matched) return 

  return GUILD.members.cache.get(user.id).roles.remove(matched.role)
})

bb.login(process.env.BB)