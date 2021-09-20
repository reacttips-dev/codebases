import useFocusableGroup from './useFocusableGroup'

export default function useKeyboardAccessibleGroup<T extends HTMLElement>() {
  const { itemProps, focusNext, focusPrevious, focusFirst, focusLast, refList } =
    useFocusableGroup<T>()

  function handleKeyDown(event: React.KeyboardEvent<any>) {
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault()
        focusPrevious()
        break
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault()
        focusNext()
        break
      case 'Home':
        event.preventDefault()
        focusFirst()
        break
      case 'End':
        event.preventDefault()
        focusLast()
        break
    }
  }

  return { containerProps: { onKeyDown: handleKeyDown }, itemProps, refList }
}
