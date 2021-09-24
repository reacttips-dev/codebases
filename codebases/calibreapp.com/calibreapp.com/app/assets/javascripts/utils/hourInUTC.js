const hourInUTC = localHour => {
  const date = new Date()

  // Shift the hour to localHour
  date.setHours(localHour)

  return date.getUTCHours()
}

export default hourInUTC
