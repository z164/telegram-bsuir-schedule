import {
    Telegraf
} from 'telegraf'

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import schedule from 'node-schedule'

import logger from './utility/logger.js'

import Chat from './Database/Chat.js'

import init from './controllers/init.js'
import toggle from './controllers/toggle.js'
import list from './controllers/list.js'

import filterToggle from './controllers/filter-toggle.js'
import filterModeToggle from './controllers/filter-mode-toggle.js'
import filterAdd from './controllers/filter-add.js'
import filterList from './controllers/filter-list.js'

import getLessons from './utility/getLessons.js'
import filterRemove from './controllers/filter-remove.js'

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
            console.log(logger('MongoDB cluster connection established', 'LOG'))
        }
    }
);

const bot = new Telegraf(process.env.TOKEN, {
    username: 'Notifier873602Bot'
})

bot.hears(/^\/init \d{6}$/gm, ctx => init(ctx))
bot.hears(/^\/toggle \d{6}$/gm, ctx => toggle(ctx))
bot.hears(/^\/list \d{6}$/gm, ctx => list(ctx))
bot.hears(/^\/filter-toggle \d{6}$/gm, ctx => filterToggle(ctx))
bot.hears(/^\/filter-mode-toggle \d{6}$/gm, ctx => filterModeToggle(ctx))
bot.hears(/^\/filter-add \d{6} .+$/gm, ctx => filterAdd(ctx))
bot.hears(/^\/filter-list \d{6}$/gm, ctx => filterList(ctx))
bot.hears(/^\/filter-remove \d{6} .+$/gm, ctx => filterRemove(ctx))



// bot.use(function(ctx, next){
// 	if( ctx.chat.id > 0 ) return next();
// 	return bot.telegram.getChatAdministrators(ctx.chat.id)
// 		.then(function(data){
// 			if( !data || !data.length ) return;
// 			console.log('admin list:', data);
// 			ctx.chat._admins = data;
// 			ctx.from._is_in_admin_list = data.some( adm => adm.user.id === ctx.from.id );
// 		})
// 		.catch(console.log)
// 		.then(_ => next(ctx));
// });

bot.launch()

const notifications = []
const ids = []

const notification = (chatID, lesson) => {
    return async () => {
        try {
            const message = await bot.telegram.sendMessage(chatID, `*\\! ATTENTION \\!*\nГруппа: ${lesson.studentGroup}\nПодгруппа: ${lesson.numSubgroup}\nНачало: ${lesson.startLessonTime}\nПредмет: ${lesson.subject}\nТип: ${lesson.lessonType}`, {
                parse_mode: 'MarkdownV2'
            })
            ids.push({
                id: message.message_id,
                chat: message.chat.id
            })
        } catch {
            console.log(logger(`Seems like ${chatID} is not reachable for bot`, 'ERROR'))
            return
        }
        console.log(logger(`Notified ${chatID} about ${lesson.subject}`, 'LOG'))
    }
}

const cleanNotifications = () => {
    console.log(logger(`Notifications amount before cleaning ${notifications.length}`, 'LOG'))
    notifications.forEach(el => el.cancel())
    notifications.splice(0, notifications.length)
    ids.forEach(id => {
        bot.telegram.deleteMessage(id.chat, id.id)
    })
    ids = []
    console.log(logger(`Notifications amount after cleaning ${notifications.length}`, 'LOG'))
}

const setTodayNotifications = (lessons, chat) => {
    lessons.forEach(lesson => {
        const [lessonHour, lessonMinute] = lesson.startLessonTime.split(':')
        if (!chat.filter) {
            notifications.push(schedule.scheduleJob({
                hour: lessonHour,
                minute: lessonMinute,
                tz: 'Etc/GMT-3'
            }, notification(chat.chatID, lesson)))
        } else {
            if (chat.filterMode === 'includes' ? chat.filters.includes(lesson.subject.toLowerCase()) : !chat.filters.includes(lesson.subject.toLowerCase())) {
                notifications.push(schedule.scheduleJob({
                    hour: lessonHour,
                    minute: lessonMinute,
                    tz: 'Etc/GMT-3'
                }, notification(chat.chatID, lesson)))
            }
        }
    })
    console.log(logger(`Notifications for today were set (${chat.chatID}, ${lessons.length} lessons)`, 'LOG'))

}

const todaysCycle = async () => {
    console.log(logger('Todays cycle init', 'LOG'))
    const chats = await Chat.find({})
    chats.forEach(async (chat) => {
        if (chat.enabled) {
            const lessons = await getLessons(chat.groupNumber)
            console.log(logger(`Lessons for ${chat.groupNumber}`, 'LOG'))
            if (!lessons) {
                console.log(logger('No lessons for today'), 'WARNING')
                return
            }
            setTodayNotifications(lessons, chat)
        } else {
            console.log(logger(`Chat with id ${chat.chatID} and group number ${chat.groupNumber} disabled bot's features`, 'WARNING'))
        }
    })
}

todaysCycle()

const autoSchedule = schedule.scheduleJob({
    hour: 4,
    minute: 0,
    tz: 'Etc/GMT-3'
}, todaysCycle)

const cleanTodaysNotifications = schedule.scheduleJob({
    hour: 3,
    minute: 0,
    tz: 'Etc/GMT-3'
}, cleanNotifications)