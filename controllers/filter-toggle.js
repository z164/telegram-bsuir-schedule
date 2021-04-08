import Chat from '../Database/Chat.js'

import logger from '../utility/logger.js'


const filterToggle = async (ctx) => {
    const chat = await Chat.findOne({
        chatID: ctx.update.message.chat.id,
        groupNumber: ctx.update.message.text.slice(-6)
    })
    if (!chat) {
        console.log(logger(`Invalid toggle call (${ctx.update.message.text.slice(-6)} does not exist in this chat)`, 'ERROR'))
        ctx.reply('This group does not exist in this chat')
        return
    }
    await Chat.findByIdAndUpdate(chat._id, {
        filter: !chat.filter
    })
    ctx.reply(`${!chat.filter ? 'Filter was enabled' : 'Filter was disabled'}`)
    console.log(logger(`Filter for ${ctx.update.message.chat.id}, group ${ctx.update.message.text.slice(-6)} were set to ${!chat.filter}`, 'LOG'))
}

export default filterToggle