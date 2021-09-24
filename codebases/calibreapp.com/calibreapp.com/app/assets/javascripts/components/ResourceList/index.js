import React from 'react'
import styled from 'styled-components'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import { Section } from '../Layout'
import { Flex, Box } from '../Grid'
import Text from '../Type'
import Image from '../Image'

const StyledResourceItem = styled(Flex)``
StyledResourceItem.defaultProps = {
  alignItems: 'center',
  flexWrap: ['wrap', 'wrap', 'nowrap']
}

export const ResourceItem = ({ id, index, children }) => {
  return (
    <Draggable draggableId={id} index={index}>
      {provided => (
        <Section
          itemType="drag"
          data-qa="resourceItem"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <StyledResourceItem>
            {typeof children === 'function' ? children(provided) : children}
          </StyledResourceItem>
        </Section>
      )}
    </Draggable>
  )
}

const StyledResourcePreview = styled(Box)``
StyledResourcePreview.defaultProps = {
  mr: 4,
  mb: [2, 2, 0],
  width: [1, 'auto']
}

export const ResourcePreview = ({ name, src, ...props }) => (
  <StyledResourcePreview {...props}>
    <Image
      src={src}
      alt={name}
      width={140}
      borderColor="grey100"
      borderWidth="1px"
      borderStyle="solid"
      borderRadius="3px"
    />
  </StyledResourcePreview>
)

export const ResourceBody = styled(Box)``
ResourceBody.defaultProps = {
  flex: 1,
  width: [1, 'auto'],
  mb: [2, 2, 0]
}

export const ResourceActions = styled(Flex)``
ResourceActions.defaultProps = {
  width: [1, 1, 'auto'],
  mb: [2, 0]
}

export const ResourceTitle = ({ children }) => (
  <Box mb="8px">
    <Text as="h3" color="grey500" fontWeight={600}>
      {children}
    </Text>
  </Box>
)

export const ResourceList = ({ onReorder, children }) => {
  return (
    <DragDropContext onDragEnd={onReorder}>
      <Droppable droppableId="droppable">
        {provided => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {children}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default ResourceList
