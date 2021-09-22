import { Dispatch } from 'redux'
import { hideFlash, showFlash } from '../stores/flash'

const notify = (events: any[]) => ({ dispatch }: { dispatch: Dispatch }) => (
  next: (action: any) => void
) => (action: any) => {
  if (events.indexOf(action.type) !== -1) {
    const { message, type, timeout } = action.payload.notification[action.type]
    dispatch(
      showFlash({
        message,
        status: type
      })
    )
    if (timeout) {
      setTimeout(() => {
        dispatch(hideFlash())
      }, timeout)
    }
  }
  return next(action)
}

export default notify
