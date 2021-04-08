import Chat from '../Database/Chat.js'

import logger from '../utility/logger.js'

const filterAdd = async (ctx) => {
    const chat = await Chat.findOne({
        chatID: ctx.update.message.chat.id,
        groupNumber: ctx.update.message.text.slice(12, 18)
    })
    if(!chat) {
        console.log(logger(`Invalid filter add call (${ctx.update.message.text.slice(-6)} does not exist in this chat)`, 'ERROR'))
        ctx.reply('This group does not exist in this chat')
        return
    }
    chat.filters = [...chat.filters, ...ctx.update.message.text.slice(18).toLowerCase().trim().split(' ')]
    await chat.save()
    ctx.reply(`Filters were set: ${chat.filters}`)
    console.log(logger(`Filters were set for ${ctx.update.message.chat.id}, group ${ctx.update.message.text.slice(-6)} ${chat.filters}`, 'LOG'))
}

export default filterAdd
