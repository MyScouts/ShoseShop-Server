const now = new Date()

const getNowToNumber = () => now.getTime()
const addMinWithNow = (total) => now.setHours(now.getMinutes() + total)
const addDateWithNow = (total) => now.setDate(now.getDate() + total)
const compareDateNow = (date) => now.getTime() == date.getTime() ? 1 : now.getTime() < date.getTime() ? 2 : 0
const compareTwoDate = (date1, date2) => date1.getTime() === date2.getTime() ? 1 : date1.getTime() < date2.getTime() ? 2 : 0
// timezone to dateTime
const timezoneToDateTime = (timezone) => date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
module.exports = {
    addMinWithNow,
    compareDateNow,
    addDateWithNow,
    getNowToNumber,
    compareTwoDate,
    timezoneToDateTime
}