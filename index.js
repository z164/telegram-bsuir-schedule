import {
    Telegraf
} from 'telegraf'

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import schedule from 'node-schedule'

import Chat from './Database/Chat.js'

import init from './controllers/init.js'
import toggle from './controllers/toggle.js'
import getLessons from './utility/getLessons.js'

dotenv.config()

mongoose.connect(
    process.env.URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    },
    (err) => {
        if (err) {
            console.error(err)
        } else {
            console.log('MongoDB cluster connection established');
        }
    }
);

const bot = new Telegraf(process.env.TOKEN, {
    username: 'Notifier873602Bot'
})

bot.hears(/^\/init \d{6}$/gm, ctx => init(ctx))
bot.hears(/^\/toggle \d{6}$/gm, ctx => toggle(ctx))

bot.launch()

const notifications = []

const notification = (chatID, lesson) => {
    return () => bot.telegram.sendMessage(chatID, `*\\! ATTENTION \\!*\nГруппа: ${lesson.studentGroup}\nПодгруппа: ${lesson.numSubgroup}\nНачало: ${lesson.startLessonTime}\nПредмет: ${lesson.subject}\nТип: ${lesson.lessonType}`, {parse_mode: 'MarkdownV2'})
}

const cleanNotifications = () => {
    notifications.forEach(el => el.cancel())
}

const setTodayNotifications = (lessons, chatID) => {
    lessons.forEach(el => {
        const [lessonHour, lessonMinute] = el.startLessonTime.split(':')
        notifications.push(schedule.scheduleJob({
            hour: lessonHour,
            minute: lessonMinute
        }, notification(chatID, el)))
    })
}

const todaysCycle = async () => {
    const chats = await Chat.find({})
    chats.forEach(async (chat) => {
        if (chat.enabled) {
            const lessons = await getLessons(chat.groupNumber)
            console.log(`Lessons for ${chat.groupNumber}`)
            if(!lessons) {
                return
            }
            console.log(lessons)
            setTodayNotifications(lessons, chat.chatID)
        } else {
            console.log(`Chat with id ${chat.chatID} and group number ${chat.groupNumber} disabled bot's features`)
        }
    })
}

todaysCycle()

const autoSchedule = schedule.scheduleJob({
    hour: 4
}, todaysCycle)

const cleanTodaysNotifications = schedule.scheduleJob({
    hour: 3
}, cleanNotifications)