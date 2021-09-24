import React from 'react'
import format from 'date-fns/format'

const FormattedDateString = ({ prefix, date }) => {
  if (!date) return ''
  const parsedDate = new Date(date)

  let startOfDay = new Date()
  startOfDay.setHours(0)
  startOfDay.setMinutes(0)
  startOfDay.setSeconds(0)

  if (parsedDate >= startOfDay) {
    const time = format(parsedDate, 'h:mma')
    return `${prefix ? `${prefix} ` : ''}Today at ${time}`
  } else {
    const date = format(parsedDate, "h:mma 'on' MMM do yyyy")
    return `${prefix ? `${prefix} at ` : ''}${date}`
  }
}

const FormattedDate = ({ date }) => <span>{FormattedDateString({ date })}</span>

export { FormattedDateString }
export default FormattedDate
