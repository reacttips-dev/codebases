const DEFAULT_NAME = 'sidebarhome_feedback'

const triggerEvent = (name = DEFAULT_NAME) => {
  return window.hj && window.hj('trigger', name)
}

export default {
  triggerEvent
}
