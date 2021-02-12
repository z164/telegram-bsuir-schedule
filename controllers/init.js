import Chat from '../Database/Chat.js'

const init = async (ctx) => {
    Chat.create({
        chatID: ctx.update.message.chat.id,
        groupNumber: ctx.update.message.text.slice(-6),
        enabled: true
    })
}

export default init