import { useState } from 'react'

function tryParse(value: string) {
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

interface Options<T> {
  key: string
  initialValue?: T
}

function useLocalStorage<T>({
  key,
  initialValue,
}: Options<T>): {
  value: T | undefined
  set: (v: T) => void
  remove: () => void
} {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item != null) {
        return tryParse(item)
      }
      window.localStorage.setItem(key, JSON.stringify(initialValue))
      return initialValue
    } catch (error) {
      window.localStorage.setItem(key, JSON.stringify(initialValue))
      return initialValue
    }
  })

  const set = (v: any) => {
    setValue(v)
    window.localStorage.setItem(key, JSON.stringify(v))
  }

  const remove = () => {
    // @ts-ignore
    setValue(undefined)
    window.localStorage.removeItem(key)
  }

  return { value, set, remove }
}

export default useLocalStorage
