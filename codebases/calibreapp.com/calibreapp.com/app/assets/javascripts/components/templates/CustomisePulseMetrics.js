import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import Button from '../Button'
import { Flex, Box, InlineBox } from '../Grid'
import Checkbox from '../Checkbox'
import { DragIcon } from '../Icon'

const CustomisePulseMetrics = ({
  metrics: initialMetrics,
  pulseMetrics,
  onCancel,
  onSave
}) => {
  const defaultMetrics = initialMetrics
    .map(metric => {
      const initialIndex = pulseMetrics.findIndex(m => m.value === metric.value)
      return {
        ...metric,
        initialIndex: initialIndex >= 0 ? initialIndex : pulseMetrics.length,
        selected: initialIndex >= 0
      }
    })
    .sort((a, b) => a.initialIndex - b.initialIndex)
  const [metrics, setMetrics] = useState(defaultMetrics)

  const saveMetrics = () => {
    const pulseMetrics = metrics.filter(m => m.selected).map(m => m.value)
    onSave(pulseMetrics)
  }

  const toggleMetric = value => {
    const metric = metrics.find(m => m.value === value)
    metric.selected = !metric.selected
    setMetrics(metrics)
  }

  const onDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    const [removed] = metrics.splice(result.source.index, 1)
    metrics.splice(result.destination.index, 0, removed)

    setMetrics(metrics)
  }

  return (
    <>
      <div className="page-section">
        <div className="row middle-xs">
          <div className="col-xs-12 col-sm-8">
            <h3 className="type-medium m--b0">Metric History</h3>
          </div>
          <div className="col-xs-12 col-sm-4 center-xs end-sm">
            <div className="type-small">
              <Flex>
                <Box ml="auto" mr={1}>
                  <Button variant="tertiary" type="button" onClick={onCancel}>
                    Cancel
                  </Button>
                </Box>
                <Box>
                  <Button type="button" onClick={saveMetrics}>
                    Save
                  </Button>
                </Box>
              </Flex>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <p className="m--b0">
              Select and drag to reorder the metrics you&lsquo;d like to see on
              Pulse
            </p>
          </div>
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {provided => (
            <Flex
              p={2}
              flexWrap="wrap"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {metrics.map((metric, index) => (
                <Draggable
                  key={metric.value}
                  draggableId={metric.value}
                  index={index}
                >
                  {provided => (
                    <Box
                      width={1}
                      mb={2}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Checkbox
                        defaultChecked={metric.selected}
                        label={metric.label}
                        value={metric.value}
                        onChange={() => toggleMetric(metric.value)}
                        beforeInput={
                          <InlineBox mr={1} className="draggable">
                            <DragIcon />
                          </InlineBox>
                        }
                      />
                    </Box>
                  )}
                </Draggable>
              ))}
            </Flex>
          )}
        </Droppable>
      </DragDropContext>
    </>
  )
}

export default CustomisePulseMetrics
