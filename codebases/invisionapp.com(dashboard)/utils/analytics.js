import { CREATE_MODAL_TYPES, HARMONY, RHOMBUS, UNKNOWN } from '../constants/DocumentTypes'

export function trackEvent (name, args = {}) {
  const collect = (window.measure && window.measure.collect) || console.log
  collect(name, args)
}

function getPropValue (ref, obj) {
  while (ref.length && (obj = obj[ref.shift()]));
  return obj
}

export function assignEventData (event, state, data) {
  let value = UNKNOWN
  let args = { ...event.args }
  // Loop event arguments and use the object
  // reference to assign a value to each argument
  for (var arg in args) {
    if (args.hasOwnProperty(arg)) {
      const ref = args[arg].split('.')
      if (ref[0] === 'analytics') {
        // Get value from analytics reducer
        value = getPropValue(ref, state)
      } else {
        // Get value from redux action data
        value = getPropValue(ref, data)
      }
      if (value === undefined) {
        value = 'error'
      }
    }
    if (arg === 'spaceType' && value !== 'error' && value !== UNKNOWN) {
      args[arg] = value ? 'team' : 'invite-only'
    } else if (arg === 'filterType' && value !== 'error' && value !== UNKNOWN) {
      if (value === 'Specs') {
        args[arg] = 'spec'
      } else {
        args[arg] = value === 'all' || value === RHOMBUS || value === HARMONY ? value : value + 's'
      }
    } else {
      args[arg] = value
    }
  }

  return args
}

export function getSubviewDocumentLabel (subview) {
  const modalType = CREATE_MODAL_TYPES.find(({ key }) => key === subview)
  if (typeof modalType !== 'undefined') return modalType.label
  return UNKNOWN
}
