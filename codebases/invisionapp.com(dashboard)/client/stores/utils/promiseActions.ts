import identity from 'lodash/identity'
import noop from 'lodash/noop'
import { Dispatch } from 'redux'
import { createAction } from 'redux-actions'

type ActionCreatorType = (
  payload: any,
  resolve: (v: any) => void,
  reject: (e: any) => void
) => any

const payloadCreator = identity
const metaCreator = (_: any, resolve = noop, reject = noop) => ({ resolve, reject })

export const createPromiseAction = (type: string) => {
  return createAction(type, payloadCreator, metaCreator)
}

export const bindActionToPromise = (
  dispatch: Dispatch<any>,
  actionCreator: ActionCreatorType
) => (payload: any) => {
  return new Promise((resolve, reject) => dispatch(actionCreator(payload, resolve, reject)))
}
