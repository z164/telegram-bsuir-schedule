import Chat from '../Database/Chat.js'

import logger from '../utility/logger.js'


const filterList = async (ctx) => {
    const chat = await Chat.findOne({
        chatID: ctx.update.message.chat.id,
        groupNumber: ctx.update.message.text.slice(-6)
    })
    if (!chat) {
        console.log(logger(`Invalid list call (${ctx.update.message.text.slice(-6)} does not exist in this chat)`, 'ERROR'))
        ctx.reply('This group does not exist in this chat')
        return
    }
    ctx.reply(`${chat.filterMode === 'inclusive' ? 'White' : 'Black'} list: ${chat.filters}`)
    console.log(logger(`Filters list invoked for ${ctx.update.message.chat.id}, group ${ctx.update.message.text.slice(-6)}`, 'LOG'))
}

export default filterList