import { formatDistanceToNow, parseISO, format } from 'date-fns'

export const formattedDate = dateString => {
  try {
    const parsedDate = parseISO(dateString)
    return format(parsedDate, 'MMMM do, yyyy')
  } catch (e) {
    return dateString
  }
}

export const daysFromNow = dateString => {
  try {
    const parsedDate = parseISO(dateString)
    return formatDistanceToNow(parsedDate)
  } catch (e) {
    return dateString
  }
}
