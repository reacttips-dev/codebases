import React, { useEffect } from 'react'

import { Box } from '@chakra-ui/react'
import { useInView } from 'react-intersection-observer'

const elementHeightCache: Record<string, number> = {}

export interface FeedLazyLoadBoxProps {
  id: string
  index: number
  minHeight: number
}

export const FeedLazyLoadBox: React.FC<FeedLazyLoadBoxProps> = ({
  id,
  index,
  minHeight,
  children,
}) => {
  const { ref, inView, entry } = useInView({
    initialInView: typeof window === 'undefined' || index < 5,
    triggerOnce: true,
    rootMargin: '1000px 0px',
  })

  useEffect(() => {
    if (entry?.isIntersecting && entry?.target.clientHeight > 0) {
      elementHeightCache[id] = Math.max(
        entry?.target.clientHeight,
        elementHeightCache[id] ?? 0,
      )
    }
  }, [entry, id])

  return (
    <Box
      ref={ref}
      minH={inView ? 'auto' : Math.max(minHeight, elementHeightCache[id] ?? 0)}
    >
      {inView ? (
        children
      ) : (
        <Box
          bg="bg.base"
          minH={Math.max(minHeight, elementHeightCache[id] ?? 0)}
        />
      )}
    </Box>
  )
}
