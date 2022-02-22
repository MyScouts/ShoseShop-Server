const now = new Date()

const addMinWithNow = (total) => now.setHours(now.getMinutes() + total)

const addDateWithNow = (total) => now.setDate(now.getDate() + total)

const compareDateNow = (date) => {
    let now = now

    if (now.getTime() == date.getTime()) {
        // date = now
        return 1;
    } else if (now.getTime() < date.getTime()) {
        // date > now
        return 2;
    } else {
        // date < now
        return 0;
    }
}

// timezone to dateTime
const timezoneToDateTime = (timezone) => {
    let date = new Date(timezone)
    let dateTime = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    return dateTime
}


const getNowToNumber = () => now.getTime()

module.exports = {
    addMinWithNow,
    compareDateNow,
    addDateWithNow,
    getNowToNumber
}