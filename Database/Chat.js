import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema({
    chatID: {
        type: String,
    },
    groupNumber: {
        type: String,
    },
    enabled: {
        type: Boolean,
    }
});

export default mongoose.model('Chat', chatSchema);