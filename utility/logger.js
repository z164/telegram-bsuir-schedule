import moment from 'moment'

const log = (message, type) => {
    return `[${moment(new Date()).format('H:mm:ss')}] [${type}] ${message}`
}

export default log