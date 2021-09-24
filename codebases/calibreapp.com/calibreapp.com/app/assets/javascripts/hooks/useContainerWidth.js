import { useState, useLayoutEffect } from 'react'

const useContainerWidth = ref => {
  const [width, setWidth] = useState(0)

  const handleResize = () => {
    const width = ref.current.getBoundingClientRect().width
    if (width > 0) setWidth(width)
  }

  useLayoutEffect(() => {
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  })

  return [width, setWidth]
}

export default useContainerWidth
