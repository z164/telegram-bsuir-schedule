import Chat from '../Database/Chat.js'

import logger from '../utility/logger.js'

const init = async (ctx) => {
    const chat = await Chat.findOne({
        chatID: ctx.update.message.chat.id,
        groupNumber: ctx.update.message.text.slice(-6)
    })
    if (chat) {
        console.log(logger(`Unnecessary (duplicate) init invoke by ${ctx.update.message.chat.id}, group ${ctx.update.message.text.slice(-6)}`, 'WARNING'))
        ctx.reply(`You already have notifications for this group in this chat`)
        return
    }
    Chat.create({
        chatID: ctx.update.message.chat.id,
        groupNumber: ctx.update.message.text.slice(-6),
        enabled: true
    })
    ctx.reply(`Initiated ${ctx.update.message.text.slice(-6)} group notifier in this chat`)
    console.log(logger(`Initiation was invoked for ${ctx.update.message.chat.id}, group ${ctx.update.message.text.slice(-6)}`, 'LOG'))
}

export default init