import { createContext, useContext } from 'react'

export interface IServerPropsContext {
  nonce: string
  query: { [key: string]: string | string[] }
  cookie: { [key: string]: string | number }
}

const ServerPropsContext = createContext<IServerPropsContext>({
  nonce: '',
  query: {},
  cookie: {},
})

ServerPropsContext.displayName = 'ServerPropsContext'

export default ServerPropsContext

export const useServerPropsContext = () => useContext(ServerPropsContext)
