import React from 'react'

export const useToggle = (
  initialValue = false,
): [boolean, () => void, () => void, () => void] => {
  const [value, setValue] = React.useState(initialValue)
  const toggle = React.useCallback(() => {
    setValue(v => !v)
  }, [])
  const open = React.useCallback(() => {
    setValue(true)
  }, [])
  const close = React.useCallback(() => {
    setValue(false)
  }, [])
  return [value, toggle, open, close]
}

export default useToggle
