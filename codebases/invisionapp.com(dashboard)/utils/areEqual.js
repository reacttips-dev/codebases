import equals from 'fast-deep-equal'

function shallowDiffers (prev, next) {
  for (let attribute in prev) {
    if (!(attribute in next)) {
      return true
    }
  }

  for (let attribute in next) {
    if (!prev[attribute] || prev[attribute] !== next[attribute]) {
      return true
    }
  }

  return false
}

function deepDiffers (prev, next) {
  for (let attribute in prev) {
    if (!(attribute in next)) {
      return true
    }
  }
  for (let attribute in next) {
    if (Array.isArray(next[attribute])) {
      if (prev[attribute].length !== next[attribute].length || !equals(prev[attribute], next[attribute])) {
        return true
      }
    } else if (next[attribute] && typeof next[attribute] === 'object') {
      if (!equals(prev[attribute], next[attribute])) {
        return true
      }
    } else if (prev[attribute] !== next[attribute]) {
      return true
    }
  }
  return false
}

export default function areEqual (prevProps, nextProps) {
  const {
    data: prevData,
    style: prevStyle,
    ...prevRest
  } = prevProps
  const {
    data: nextData,
    style: nextStyle,
    ...nextRest
  } = nextProps

  return (
    !deepDiffers(prevData, nextData) &&
    !shallowDiffers(prevStyle, nextStyle) &&
    !shallowDiffers(prevRest, nextRest)
  )
}
