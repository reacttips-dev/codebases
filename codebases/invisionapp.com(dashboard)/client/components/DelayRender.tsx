import { useEffect, useState } from 'react'

type DelayRenderProps = {
  delay?: number
  renderImmediately?: boolean
  children: any
}

const DelayRender = (props: DelayRenderProps) => {
  const { delay = 0, renderImmediately = false, children } = props

  const [shouldRender, setShouldRender] = useState(renderImmediately)
  let timeout: any

  useEffect(() => {
    if (!renderImmediately) {
      clearTimeout(timeout)
      timeout = setTimeout(() => setShouldRender(true), delay)
    }

    return () => clearTimeout(timeout)
  }, [])

  return shouldRender ? children : null
}

export default DelayRender
