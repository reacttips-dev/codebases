import React, { createContext, useReducer } from 'react'

const initialState = {
  topics: [],
  visibility: false,
}
export const TopicsStore = createContext<any>(initialState)
const { Provider } = TopicsStore

const SHOW_TOPICS_MODAL_ACTION = 'SHOW_TOPICS_MODAL'
const HIDE_TOPICS_MODAL_ACTION = 'HIDE_TOPICS_SHOW_TOPICS_MODAL'

export const TopicsModalProvider = ({ children }) => {
  const [state, dispatch] = useReducer((_, action) => {
    switch (action.type) {
      case SHOW_TOPICS_MODAL_ACTION:
        return { visibility: true, topics: action.payload, slug: action.slug }
      case HIDE_TOPICS_MODAL_ACTION:
        return { visibility: false, topics: [] }
      default:
        return initialState
    }
  }, initialState)

  const showTopicsModal = (topics, slug): void => {
    dispatch({ type: SHOW_TOPICS_MODAL_ACTION, payload: topics, slug })
  }

  const hideTopicsModal = (): void => {
    dispatch({ type: HIDE_TOPICS_MODAL_ACTION })
  }

  return (
    <Provider value={{ state, showTopicsModal, hideTopicsModal }}>
      {children}
    </Provider>
  )
}
