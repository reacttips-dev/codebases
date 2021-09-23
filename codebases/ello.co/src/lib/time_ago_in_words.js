/* eslint no-extend-native: [2, {"exceptions": ["Date"]}] */
/* eslint-disable max-len */
/* eslint-disable prefer-template */
const timeAgoInWordsStrings = {
  // prefix adverbs
  about: '~',
  almost: '<',
  lessThan: '<',
  over: '+',
  // suffix time units
  seconds: 's',
  minute: 'm',
  minutes: 'm',
  hour: 'h',
  hours: 'h',
  day: 'd',
  days: 'd',
  months: 'mth',
  year: 'y',
  years: 'y',
}

Date.prototype.distanceOfTimeInWords = function distanceOfTimeInWords(toDate) {
  const MINUTES_IN_YEAR = 525600
  const MINUTES_IN_QUARTER_YEAR = 131400
  const MINUTES_IN_THREE_QUARTERS_YEAR = 394200

  const distanceInSeconds = Math.round(Math.abs((toDate.getTime() - this.getTime()) / 1000))
  const distanceInMinutes = Math.round(distanceInSeconds / 60)

  let remainder = null
  let distanceInYears = null
  let yearProp = null
  switch (true) {
    case (distanceInMinutes <= 1):
      switch (true) {
        case (distanceInSeconds < 5):
          return timeAgoInWordsStrings.lessThan + '5' + timeAgoInWordsStrings.seconds
        case (distanceInSeconds >= 5 && distanceInSeconds <= 9):
          return timeAgoInWordsStrings.lessThan + '10' + timeAgoInWordsStrings.seconds
        case (distanceInSeconds >= 10 && distanceInSeconds <= 19):
          return timeAgoInWordsStrings.lessThan + '20' + timeAgoInWordsStrings.seconds
        case (distanceInSeconds >= 20 && distanceInSeconds <= 39):
          return '30' + timeAgoInWordsStrings.seconds
        case (distanceInSeconds >= 40 && distanceInSeconds <= 59):
          return timeAgoInWordsStrings.lessThan + '1' + timeAgoInWordsStrings.minute
        default:
          return '1' + timeAgoInWordsStrings.minute
      }
    case (distanceInMinutes >= 2 && distanceInMinutes <= 45):
      return distanceInMinutes + timeAgoInWordsStrings.minutes
    case (distanceInMinutes >= 45 && distanceInMinutes <= 90):
      return timeAgoInWordsStrings.about + '1' + timeAgoInWordsStrings.hour
    // 90 mins up to 24 hours
    case (distanceInMinutes >= 90 && distanceInMinutes <= 1440):
      return timeAgoInWordsStrings.about + Math.round(distanceInMinutes / 60) + timeAgoInWordsStrings.hours
    // 24 hours up to 42 hours
    case (distanceInMinutes >= 1440 && distanceInMinutes <= 2520):
      return '1' + timeAgoInWordsStrings.day
    // 42 hours up to 30 days
    case (distanceInMinutes >= 2520 && distanceInMinutes <= 43200):
      return Math.round(distanceInMinutes / 1440) + timeAgoInWordsStrings.days
    // 30 days up to 60 days
    case (distanceInMinutes >= 43200 && distanceInMinutes <= 86400):
      return timeAgoInWordsStrings.about + Math.round(distanceInMinutes / 43200) + timeAgoInWordsStrings.months
    // 60 days up to 365 days
    case (distanceInMinutes >= 86400 && distanceInMinutes <= 525600):
      return Math.round(distanceInMinutes / 43200) + timeAgoInWordsStrings.months
    // TODO: handle leap year like rails does
    default:
      remainder = distanceInMinutes % MINUTES_IN_YEAR
      distanceInYears = Math.floor(distanceInMinutes / MINUTES_IN_YEAR)
      yearProp = distanceInYears <= 1 ? 'year' : 'years'
      if (remainder < MINUTES_IN_QUARTER_YEAR) {
        return timeAgoInWordsStrings.about + distanceInYears + timeAgoInWordsStrings[yearProp]
      } else if (remainder < MINUTES_IN_THREE_QUARTERS_YEAR) {
        return timeAgoInWordsStrings.over + distanceInYears + timeAgoInWordsStrings[yearProp]
      }
      return timeAgoInWordsStrings.almost + (distanceInYears + 1) + timeAgoInWordsStrings[yearProp]
  }
}

Date.prototype.timeAgoInWords = function timeAgoInWords() {
  return this.distanceOfTimeInWords(new Date())
}

function updateStrings(dict = {}) {
  Object.keys(dict).forEach((key) => {
    const value = dict[key]
    if ({}.hasOwnProperty.call(timeAgoInWordsStrings, key)) {
      timeAgoInWordsStrings[key] = value
    } else {
      throw new Error(`TimeAgoInWords updateStrings key ${key} is not supported.`)
    }
  })
}

export { updateStrings }
export default updateStrings

