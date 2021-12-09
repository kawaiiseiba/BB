module.exports = async (bb) => {
    // bb.api.applications(bb.user.id).guilds('848169570954641438').commands('886110319611617310').delete()
    // bb.api.applications(bb.user.id).guilds('848169570954641438').commands.post({
    //   data: {
    //     name: "dbd",
    //     description: `DeadByDaylight commands for αℓтяια`,
    //     default_permission: false,
    //     options: [
    //       {
    //         name: "killer",
    //         description: "Choose a random killer among voice channel participants",
    //         type: 1
    //       }
    //     ]
    //   }
    // })
    console.log(await bb.api.applications(bb.user.id).guilds('848169570954641438').commands.get())
  }