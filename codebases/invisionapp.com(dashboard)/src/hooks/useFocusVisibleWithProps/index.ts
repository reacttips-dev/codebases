import useFocusVisible from '../useFocusVisible'

function useFocusVisibleWithProps<T = HTMLInputElement>(props: any = {}) {
  const {
    focusVisible,
    onFocus: handleFocus,
    onBlur: handleBlur,
  } = useFocusVisible()

  function onFocus(e: React.FocusEvent<T>) {
    props.onFocus && props.onFocus(e)
    handleFocus()
  }

  function onBlur(e: React.FocusEvent<T>) {
    props.onBlur && props.onBlur(e)
    handleBlur()
  }

  return {
    focusVisible,
    onFocus,
    onBlur,
  }
}

export default useFocusVisibleWithProps
