import React, { useRef } from 'react'
import { createContext, useContext } from 'react'

export type Trigger = (event: React.MouseEvent<HTMLElement>) => void

const ChatWithUsContext = createContext<{
  onClick: Trigger
}>({ onClick: () => {} })

export function ChatWithUsProvider({ children }: React.PropsWithChildren<{}>) {
  const refs: Record<string, React.RefObject<HTMLButtonElement>> = {
    'data-all-in-one-premium': useRef<HTMLButtonElement>(null),
    'data-customer-engagement-premium': useRef<HTMLButtonElement>(null),
    'data-customer-support-premium': useRef<HTMLButtonElement>(null),
    'data-lead-generation-premium': useRef<HTMLButtonElement>(null),
  }

  const onButtonClick: Trigger = (event) => {
    const target = event.currentTarget as HTMLElement

    const key = Object.keys(refs).find(
      (key) => target.matches(`[${key}="true"]`) || target.querySelector(`[${key}="true"]`),
    )

    if (key) {
      const proxyTrigger = refs[key].current
      if (!proxyTrigger) return
      proxyTrigger.click()
    }
  }

  return (
    <ChatWithUsContext.Provider value={{ onClick: onButtonClick }}>
      {Object.entries(refs).map(([dataAttribute, ref]) => (
        <button
          type="button"
          key={dataAttribute}
          tabIndex={-1}
          aria-hidden="true"
          style={{
            position: 'absolute',
            height: '1px',
            width: '1px',
            overflow: 'hidden',
            clip: 'rect(1px, 1px, 1px, 1px)',
            whiteSpace: 'nowrap',
          }}
          {...{ [dataAttribute]: 'true', ref }}
        >
          blank
        </button>
      ))}

      {children}
    </ChatWithUsContext.Provider>
  )
}

export function useChatWithUsTrigger() {
  const { onClick } = useContext(ChatWithUsContext)
  return onClick
}
