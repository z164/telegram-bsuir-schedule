import Chat from '../Database/Chat.js'

import logger from '../utility/logger.js'

const filterRemove = async (ctx) => {
    const chat = await Chat.findOne({
        chatID: ctx.update.message.chat.id,
        groupNumber: ctx.update.message.text.slice(15, 21)
    })
    if (!chat) {
        console.log(logger(`Invalid filter-remove call (${ctx.update.message.text.slice(-6)} does not exist in this chat)`, 'ERROR'))
        ctx.reply('This group does not exist in this chat')
        return
    }
    const filtersToRemove = ctx.update.message.text.slice(21).toLowerCase().trim().split(' ')
    chat.filters = chat.filters.filter(el => !filtersToRemove.includes(el))
    await chat.save()
    ctx.reply(`Filters were deleted`)
    console.log(logger(`Filters delete for ${ctx.update.message.chat.id}, group ${ctx.update.message.text.slice(-6)} were invoked`, 'LOG'))
}

export default filterRemove