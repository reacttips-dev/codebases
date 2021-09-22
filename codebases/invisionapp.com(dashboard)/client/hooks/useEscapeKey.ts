import { useEffect } from 'react'

const useEscapeKey = (callback: () => void, dependencies = []) => {
  if (dependencies.length === 0) {
    throw new Error('Dependencies are required to correctly handle the escape key hook')
  }

  const keyHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      callback()
    }
  }

  const removeListener = () => document.removeEventListener('keyup', keyHandler)

  useEffect(() => {
    document.addEventListener('keyup', keyHandler)

    return removeListener
  }, dependencies)

  return removeListener
}

export default useEscapeKey
