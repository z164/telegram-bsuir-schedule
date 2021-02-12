import Chat from '../Database/Chat.js'

const toggle = async (ctx) => {
    await Chat.findOneAndUpdate({
        chatID: ctx.update.message.chat.id,
        groupNumber: ctx.update.message.text.slice(-6)
    }, {
        enabled: false
    })
}

export default toggle