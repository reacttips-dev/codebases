import React, { useRef } from 'react'

import { XYCoord } from 'dnd-core'
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd'

import { DraggableItemTypes } from './DraggableItemTypes'
import { StyledDraggableItem } from './StyledDraggableItem'

export interface DraggableBoxProps {
  id: string
  index: number
  onMove: (dragIndex: number, hoverIndex: number) => void
  [x: string]: any
}

export const DraggableBox: React.FC<DraggableBoxProps> = ({
  id,
  index,
  onMove,
  children,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null)

  const [{ handlerId }, drop] = useDrop({
    accept: DraggableItemTypes.DraggableBox,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DraggableBoxProps, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      onMove(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: DraggableItemTypes.DraggableBox,
    item: () => {
      return { id, index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(drop(ref))

  return (
    <StyledDraggableItem
      ref={ref}
      data-handler-id={handlerId}
      isDragging={isDragging}
      {...props}
    >
      {children}
    </StyledDraggableItem>
  )
}
