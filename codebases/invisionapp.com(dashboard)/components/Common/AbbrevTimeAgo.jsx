import React from 'react'
import TimeAgo from 'react-timeago'

const abbreviations = {
  second: 's',
  minute: 'm',
  hour: 'h',
  day: 'd',
  week: 'w',
  month: 'mo',
  year: 'y'
}

function formatter (value, unit) {
  const abbrevUnit = abbreviations[unit] || unit
  return `${value}${abbrevUnit} ago`
}

const AbbrevTimeAgo = props => <TimeAgo formatter={formatter} {...props} />

export default AbbrevTimeAgo
