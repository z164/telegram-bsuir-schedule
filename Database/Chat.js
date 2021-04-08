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
    },
    filter: {
        type: Boolean,
    },
    filterMode: {
        type: String,
    },
    filters: {
        type: [String]
    }
});

export default mongoose.model('Chat', chatSchema);