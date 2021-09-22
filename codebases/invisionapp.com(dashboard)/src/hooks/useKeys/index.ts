import { useEffect, useCallback } from 'react'
import hotkeys, { HotkeysEvent } from 'hotkeys-js'

type AvailableTags = 'INPUT' | 'TEXTAREA' | 'SELECT'

export type UseKeysOptions = {
  splitKey?: string
  keyup?: boolean
  keydown?: boolean
}

function useKeys(
  keys: string,
  callback: (event: KeyboardEvent, handler: HotkeysEvent) => void,
  options: UseKeysOptions = {},
  deps: any[] = []
) {
  const memoedCallback = useCallback(callback, [...deps, callback])

  useEffect(() => {
    hotkeys(keys, options, memoedCallback)

    return () => hotkeys.unbind(keys, memoedCallback)
  }, [memoedCallback, options, keys])
  return true
}

export default useKeys
