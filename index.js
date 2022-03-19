require('dotenv').config()
const Discord = require('discord.js')

const bb = new Discord.Client({ 
  intents: [
    Discord.Intents.FLAGS.GUILDS, 
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_BANS, 
    Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, 
    Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
    Discord.Intents.FLAGS.GUILD_WEBHOOKS,
    Discord.Intents.FLAGS.GUILD_INVITES,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    Discord.Intents.FLAGS.GUILD_PRESENCES,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.GUILD_SCHEDULED_EVENTS,
    // Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
    // Discord.Intents.FLAGS.DIRECT_MESSAGES,
    // Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    // Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING
  ] 
})
const mongoose = require('mongoose')

mongoose.connect(process.env.AkashicRecords, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true
}).catch(console.log)

const slashCommands = require('./slash_commands/slash')

const GAMES_EMOJI = require('./schemas/games_emoji')
const GAMES_VC = require('./schemas/games_voice')

const db = mongoose.connection
db.on('error', e => console.log({ message: e.message }))
db.on('open', async () => {
  const current = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
  console.log(`BB's connected to Master's data sets\nDate: ${current}`)
})

// bb.on(`guildScheduledEventCreate`, guild => {
//   console.log(guild)
// })

// bb.on(`guildScheduledEventUpdate`, (oldState, newState) => {
// })

const createWelcomeMsg = user => {
    const msg = [
        "{user} just joined. Everyone, look busy!",
        "{user} just joined. Can I get a heal?",
        "{user} joined your party.",
        "{user} joined. You must construct additional pylons.",
        "Ermagherd. {user} is here.",
        "Welcome, {user}. Stay awhile and listen.",
        "Welcome, {user}. We were expecting you ( ͡° ͜ʖ ͡°)",
        "Welcome, {user}. We hope you brought pizza.",
        "Welcome {user}. Leave your weapons by the door.",
        "A wild {user} appeared.",
        "Swoooosh. {user} just landed.",
        "Brace yourselves. {user} just joined the {role}.",
        "{user} just joined. Hide your bananas.",
        "{user} just arrived. Seems OP - please nerf.",
        "{user} just slid into the {role}.",
        "A {user} has spawned in the {role}.",
        "Big {user} showed up!",
        "Where's {user}? In the {role}!",
        "{user} hopped into the {role}. Kangaroo!!",
        "{user} just showed up. Hold my beer.",
        "Challenger approaching - {user} has appeared!",
        "It's a bird! It's a plane! Nevermind, it's just {user}.",
        "Never gonna give {user} up. Never gonna let {user} down.",
        "Ha! {user} has joined! You activated my trap card!",
        "Cheers, love! {user}'s here!",
        "Hey! Listen! {user} has joined!",
        "We've been expecting you {user}",
        "It's dangerous to go alone, take {user}!",
        "{user} has joined the {role}! It's super effective!",
        "Cheers, love! {user} is here!",
        "{user} is here, as the prophecy foretold.",
        "{user} has arrived. Party's over.",
        "Ready player {user}",
        "{user} is here to kick butt and chew bubblegum. And {user} is all out of gum.",
        "Hello. Is it {user} you're looking for?",
        "{user} has joined. Stay a while and listen!",
        "Roses are red, violets are blue, {user} joined this {role} with you",
    ]

    const chosen = msg[getRandomIntInclusive(0, msg.length)]

    if(chosen.includes(`{role}`)){
        return chosen.replace(`{user}`, `<@!${user.id}>`).replace(`{role}`, `<@&924554107585458178>`)
    }

    return chosen.replace(`{user}`, `<@!${user.id}>`)
}

// bb.on(`guildScheduledEventUserAdd`, async (guildEvent, user) => {
//     if(guildEvent.id !== `924581951644508160`) return
//     if(user.bot) return

//     const altria = bb.guilds.cache.get(guildEvent.guildId)
//     const member = altria.members.cache.get(user.id)
//     const round_table = altria.channels.cache.get(`924556951600377896`)
//     await member.roles.add(`924554107585458178`)

//     round_table.send({ 
//         content: `Psst! Hey ${user.toString()}-senpai, you have arrived at the <@&924554107585458178>`,
//         files: [
//             {
//                 attachment: `https://community.gamepress.gg/uploads/default/optimized/4X/9/0/5/90575353b880e30e02c53b49796b97175dbf63e7_2_375x500.jpeg`,
//                 name: `youre_welcome_${user.username}-senpai.png`
//             }
//         ],
//         ephemeral: true
//     })
// })

// bb.on(`guildScheduledEventUserRemove`, async (guildEvent, user) => {
//     if(guildEvent.id !== `924581951644508160`) return
//     if(user.bot) return

//     const altria = bb.guilds.cache.get(guildEvent.guildId)
//     const member = altria.members.cache.get(user.id)
//     const round_table = altria.channels.cache.get(`924556951600377896`)
//     await member.roles.remove(`924554107585458178`)

//     round_table.send({ 
//         content: `${user.toString()} leaves the <@&924554107585458178>, he/she's not my senpai anymore (╯°□°）╯︵ ┻━┻`,
//         files: [
//             {
//                 attachment: `https://community.gamepress.gg/uploads/default/optimized/4X/b/c/c/bcc666c19029cba47fc0a09fc0b98cf8b09ca05a_2_586x500.jpeg`,
//                 name: `good_riddance${user.username}.png`
//             }
//         ]
//     })
// })

bb.on(`interactionCreate`, async interaction => {
  if(!interaction.inGuild) return
  if(!interaction.isCommand) return
  if(interaction.user.bot) return

  if(interaction.commandName !== `dbd`) return
  
  const commands = interaction.options.getSubcommand()

  if(commands === `killer`){

    const vc = interaction.member.voice

    if(!interaction.member.roles.cache.some(role => role.id === '916547312061407312')) return await interaction.reply({ content: `For <@&916547312061407312> use only~\nAdd roles here 👉 <#913061856124469278>`, ephemeral: true })
    if(!vc.channelId) return await interaction.reply({ content: `${interaction.user.toString()} You need to be in a voice channel to use this command!`, ephemeral: true })

    await interaction.deferReply()
    
    const CONNECTED = vc.channel.members.filter(member => member.roles.cache.some(role => role.id === '916547312061407312'))

    const PARTICIPANTS = Array.from(CONNECTED, ([name, value]) => value)

    const size = PARTICIPANTS.length - 1

    const KILLER = PARTICIPANTS[getRandomIntInclusive(0, size)]

    const user = KILLER.user

    const SURVIVORS = PARTICIPANTS.map(member => member.user).filter(member => member.id !== user.id).map(user => user.username)

    const embed = {
      title: `Killer ☠️`,
      color: 3092790,
      description: `**${user.username}** is the killer!\n\n\`\`\`Participants:\n${SURVIVORS.join(', ')}\`\`\``,
      thumbnail: {
        url: `https://cdn.discordapp.com/attachments/851100823164682240/918476932805455882/image_2021-12-09_201837.png`
      },
    }

    return await interaction.followUp({ embeds: [embed] })
  }
})

bb.on(`voiceStateUpdate`, async (oldState, newState) => {
  if(oldState.channelId === newState.channelId) return
  return await updateVcPositions(newState.id)
})

// bb.on(`presenceUpdate`, async (oldState, newState) => {
//   await updateVcPositions(newState.userId)

//   return await updateBotStats(newState)
// })

// bb.on('messageReactionAdd', async (reaction, user) => {
//   let msg = reaction.message, emoji = reaction.emoji
//   const GUILD = bb.guilds.cache.get('848169570954641438')
  
//   if(user.bot) return

//   if(msg.channel.id === `870747129499500595`){
//     if(emoji.name === `👋`) return
//     if(emoji.id !== `909069250201808927`) return reaction.users.remove(user.id)
//     if(!GUILD.members.cache.get(user.id).roles.cache.some(r => r.id === `908962125546934312`)) return reaction.users.remove(user.id)

//     const mentioned = msg.mentions.users.first()
//     const member = GUILD.members.cache.get(mentioned.id)
//     const isFarside = member.roles.cache.some(r => r.id === `908962125546934312`)

//     if(isFarside){
//       if(user.id !== `851062978416869377`) return reaction.users.remove(user.id)
      
//       await member.roles.remove(`908962125546934312`)
//       await member.roles.remove(`912698141055275008`)

//       const games_emoji = await GAMES_EMOJI.find()

//       games_emoji.map(async i => {
//         const hasRole = member.roles.cache.some(r => r.id === i.role)
        
//         if(hasRole) return await member.roles.remove(i.role)
//       })

//       return reaction.users.remove(user.id)
//     }

//     await member.roles.add(`908962125546934312`)
//     await member.roles.add(`912698141055275008`)

//     return reaction.users.remove(user.id)
//   }

//   if(msg.channel.id === `913061856124469278`) {
//     if(msg.id !== `913292251638140988`) return

//     const games_emoji = await GAMES_EMOJI.find()

//     const matched = games_emoji.find(data => data.emoji === emoji.id)

//     if(!matched) return reaction.users.remove(user.id)

//     return GUILD.members.cache.get(user.id).roles.add(matched.role)
//   }
// })

// bb.on('messageReactionRemove', async (reaction, user) => {
//   let msg = reaction.message, emoji = reaction.emoji
//   const GUILD = bb.guilds.cache.get('848169570954641438')

//   if(msg.channel.id !== `913061856124469278`) return
//   if(msg.author.bot) return

//   if(msg.id !== `913292251638140988`) return

//   const games_emoji = await GAMES_EMOJI.find()

//   const matched = games_emoji.find(data => data.emoji === emoji.id)

//   if(!matched) return 

//   return GUILD.members.cache.get(user.id).roles.remove(matched.role)
// })

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

    const activity = presence?.activities.find(activity => activity.type === `PLAYING`)

    if(!activity || presence.activities.length < 1 || (presence.activities.length === 1 && presence.activities[0].type === `CUSTOM_STATUS`)) {
      const lounge = games_vc[0]
      
      if(voiceState.channel.id === lounge.vc) return
      
      return await voiceState.setChannel(lounge.vc)
    }

    const matched = games_vc.find(data => data.game === activity.name.toLowerCase())

    if(matched && !matched.role) return await voiceState.setChannel(matched.vc)
    if(matched && !member.roles.cache.some(role => role.id === matched.role)) return
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

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min) //The maximum is inclusive and the minimum is inclusive
}

async function updateBotStats(presence) {
    if(!presence) return
    const altria = bb.guilds.cache.get('848169570954641438')
    const member = altria.members.cache.get(presence.userId)
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
    bb.login(process.env.BB)
}

const resetStatusActivity = () => {
    bb.user.setPresence(
        { 
        activities: [
            { 
                name: "with Senpai<3",
                type: `PLAYING`
            }
        ],
        status: 'online'
        }
    )
}

bb.login(process.env.BB)

bb.on(`disconnect`, () => {
    console.log(`[Disconnect] ${bb.user.username}'s client WebSocket has closed and will no longer attempt to reconnect.`)
})

bb.on(`reconnecting`, () => {
    console.log(`[Reconnecting] ${bb.user.username}'s client tries to reconnect to the WebSocket.`)
})

bb.on(`resume`, replays => {
    resetStatusActivity()
    console.log(`[Resume] ${bb.user.username}'s client reconnected. Replayed: ${replays}`)
})

bb.on(`ready`, async () => {
    resetStatusActivity()

    const altria = bb.guilds.cache.get('848169570954641438')

    const bots = [
        `881189615883669505`, // Luke
        `868813919177814036`, // Noelle
        `860402673635557376`, //Katheryne
        `873168515442573312`, // Meltryllis
    ]

    // bots.map(async v => {
    //     const user = altria.members.cache.get(v)

    //     await updateBotStats(user.presence)
    // })

    // await slashCommands(bb)

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

    /*************************************
     *
     *  ADDING SLASH COMMAND PERMISSIONS
     *
     *************************************/

    // const GUILD = bb.guilds.cache.get('848169570954641438')
    // const MANAGER_CMD = await GUILD.commands.fetch('918452944528080896')

    // const manager_permissions = {
    //   id: '870746490451148858',
    //   type: 'ROLE',
    //   permission: false,
    // }

    // MANAGER_CMD.permissions.add({ permissions: [manager_permissions] }).then(console.log)
})