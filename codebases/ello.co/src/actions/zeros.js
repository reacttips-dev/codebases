import { ZEROS } from '../constants/action_types'

export function sayHello({ username }) {
  return {
    type: ZEROS.SAY_HELLO,
    payload: { username },
  }
}

export default sayHello

