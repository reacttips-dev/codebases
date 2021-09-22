import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { startDocumentDrag, endDocumentDrag } from '../actions'

let isDropping = false
let selected = []

const dropToSidebar = (
  dragDropEnabled = false,
  selectedFromStore = [],
  setIsDropping,
  setMouseCoords,
  spaces = []) => {
  selected = selectedFromStore

  const dispatch = useDispatch()

  const handleDragStart = e => {
    if (!dragDropEnabled) return

    // Don't want to do anything if the sidebar is minimized
    const sidebarVisible = window.matchMedia('(max-width: 1023px)')
    const docComponent = e.target.closest('[data-selectable="true"]')
    if (!!sidebarVisible.matches || !docComponent || docComponent.getAttribute('draggable') === 'false') {
      return
    }

    e.preventDefault()
    isDropping = true

    setIsDropping(true)

    if (!document.body.classList.contains('is-dropping')) {
      document.body.classList.add('is-dropping')
    }

    const selectedSpaceIDs = selected.filter(s => s.currentSpaceID !== '').map(s => s.currentSpaceID)
    const filteredSpaces = spaces.filter(s => selectedSpaceIDs.indexOf(s.id) >= 0)

    const hasPublic = filteredSpaces.some(s => s.data.isPublic)
    const hasPrivate = filteredSpaces.some(s => !s.data.isPublic)

    dispatch(startDocumentDrag(
      {
        type: docComponent.dataset.type,
        id: docComponent.dataset.id,
        title: docComponent.dataset.title,
        currentSpaceID: docComponent.dataset.currentSpace
      },
      selected,
      hasPublic,
      hasPrivate
    ))

    document.addEventListener('mousemove', handleDrag, false)
    // document.addEventListener('touchmove', handleDrag, false)
    // window.addEventListener('touchup', handleDragEnd, { once: true })
    window.addEventListener('mouseup', handleDragEnd, { once: true })
  }

  const handleDrag = e => {
    if (!isDropping) return

    e.preventDefault()
    e.stopPropagation()

    setMouseCoords({ x: e.clientX, y: e.clientY, isHovering: !!e.target.closest('[data-space-droparea="true"]') })
  }

  const handleDragEnd = e => {
    if (!isDropping) return

    if (document.body.classList.contains('is-dropping')) {
      document.body.classList.remove('is-dropping')
    }

    document.removeEventListener('mousemove', handleDrag, false)
    // document.removeEventListener('touchmove', handleDrag, false)

    const droppingOnSpace = !!e.target.closest('[data-space-droparea="true"]')

    isDropping = false
    setIsDropping(false)
    setMouseCoords({ x: 0, y: 0, isHovering: false })

    dispatch(endDocumentDrag(droppingOnSpace))
  }

  return useEffect(() => {
    document.addEventListener('dragstart', handleDragStart, false)

    return () => {
      document.removeEventListener('dragstart', handleDragStart, false)
    }
  }, [dragDropEnabled])
}

export default dropToSidebar
