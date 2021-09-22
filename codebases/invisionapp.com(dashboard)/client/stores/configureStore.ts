import { createStore, applyMiddleware, compose } from 'redux'
import { browserHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'
import createSagaMiddleware from 'redux-saga'
import reduxThunk, { ThunkAction } from 'redux-thunk'
// @ts-ignore - TODO: the plan is to remove sagas
import sagas from '../sagas'
import reducer, { AppState } from './index'
import notify from '../middlewares/notification'
import { NOTIFICATION_EVENTS } from './notifications'

declare module 'redux' {
  // allows for calling dispatch with async/thunk actions
  interface Dispatch<A extends Action = AnyAction> {
    <S, E, R>(asyncAction: ThunkAction<R, S, E, A>): R
  }
}

const sagaMiddleware = createSagaMiddleware()
// @ts-ignore - TODO: fix TS error
const reduxRouterMiddleware = routerMiddleware(browserHistory)
const notificationMiddleware = notify(NOTIFICATION_EVENTS)

const middleware = [reduxThunk, sagaMiddleware, reduxRouterMiddleware, notificationMiddleware]

export default function configureStore(initialState: AppState) {
  const store = createStore(reducer, initialState, compose(applyMiddleware(...middleware)))

  sagaMiddleware.run(sagas)

  return store
}
