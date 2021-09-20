import { useLayoutEffect, useEffect } from 'react'

// A server-friendly way of using useLayoutEffect
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect
