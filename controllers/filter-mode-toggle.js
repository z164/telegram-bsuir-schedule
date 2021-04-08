import Chat from '../Database/Chat.js'

import logger from '../utility/logger.js'

const filterModeToggle = async (ctx) => {
    const chat = await Chat.findOne({
        chatID: ctx.update.message.chat.id,
        groupNumber: ctx.update.message.text.slice(-6)
    })
    if(!chat) {
        console.log(logger(`Invalid filter toggle mode call (${ctx.update.message.text.slice(-6)} does not exist in this chat)`, 'ERROR'))
        ctx.reply('This group does not exist in this chat')
        return
    }
    await Chat.findByIdAndUpdate(chat._id, {
        filterMode: (chat.filterMode === 'inclusive' ? 'exclusive' : 'inclusive')
    })
    ctx.reply(`${chat.filterMode === 'inclusive' ?  'Filter mode was set to exclusive' : 'Filter mode was set to inclusive'}`)
    console.log(logger(`Filter mode for ${ctx.update.message.chat.id}, group ${ctx.update.message.text.slice(-6)} was set to ${(chat.filterMode === 'inclusive' ? 'exclusive' : 'inclusive')}`, 'LOG'))
}

export default filterModeToggle