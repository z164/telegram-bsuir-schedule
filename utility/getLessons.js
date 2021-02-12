import axios from 'axios'

const getLessons = async (group) => {
    let schedule
    try {
        schedule = await axios.get(`https://journal.bsuir.by/api/v1/portal/schedule?studentGroup=${group}`)
    } catch {
        console.log(`Bad group number (${group})`)
        return
    }
    const lessons = []
    schedule.data.todaySchedules.forEach(el => {
        lessons.push({
            studentGroup: el.studentGroup[0],
            numSubgroup: el.numSubgroup === 0 ? 'Вся группа' : el.numSubgroup,
            startLessonTime: el.startLessonTime,
            subject: el.subject,
            lessonType: el.lessonType,
        })
    })
    return lessons
}

export default getLessons