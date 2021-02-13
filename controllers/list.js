import getLessons from '../utility/getLessons.js';
import logger from '../utility/logger.js'

const list = async (ctx) => {
    let result = '*Расписание на сегодня*\n\\=\\=\\=\\=\\=\\=\\=\\=\\=\\=\\=\\=\n'
    const lessons = await getLessons(ctx.update.message.text.slice(-6))
    if (!lessons) {
        ctx.reply('Either there are no lessons for today or the group number is invalid')
        console.log(logger(`List was invoked for ${ctx.update.message.chat.id}, group ${ctx.update.message.text.slice(-6)} (No lessons or group is invalid)`, 'ERROR'))
        return
    }
    lessons.forEach(lesson => {
        result += `Подгруппа: ${lesson.numSubgroup}\nНачало: ${lesson.startLessonTime}\nПредмет: ${lesson.subject}\nТип: ${lesson.lessonType}\n\\=\\=\\=\\=\\=\\=\\=\\=\\=\\=\\=\\=\n`
    })
    ctx.reply(result, {
        parse_mode: "MarkdownV2"
    })
    console.log(logger(`List was invoked for ${ctx.update.message.chat.id}, group ${ctx.update.message.text.slice(-6)}`, 'LOG'))
}

export default list