import { useMemo } from 'react'
import { bindActionCreators } from 'redux'
import { useDispatch, useSelector } from 'react-redux'

import * as actions from '../../../actions'
import * as serverActions from '../../../actions/server-actions'

export const useStoreProps = () => {
  return {
    account: useSelector(state => state.account),
    config: useSelector(state => state.config),
    links: useSelector(state => state.links),
    modal: useSelector(state => state.modal),
    permissions: useSelector(state => state.permissions),
    project: useSelector(state => state.project),
    selected: useSelector(state => state.selected),
    sidebar: useSelector(state => state.sidebar),
    spaces: useSelector(state => state.spaces),
    subscription: useSelector(state => state.subscription)
  }
}

export const useActions = () => {
  const dispatch = useDispatch()
  return useMemo(
    () => {
      return bindActionCreators(actions, dispatch)
    }, [dispatch]
  )
}

export const useServerActions = () => {
  const dispatch = useDispatch()
  return useMemo(
    () => {
      return Object.keys(serverActions).reduce((acc, key) => {
        acc[key] = bindActionCreators(serverActions[key], dispatch)
        return acc
      }, {})
    }
  )
}

export default function useRedux () {
  return {
    ...useStoreProps(),
    actions: useActions(),
    serverActions: useServerActions()
  }
}
