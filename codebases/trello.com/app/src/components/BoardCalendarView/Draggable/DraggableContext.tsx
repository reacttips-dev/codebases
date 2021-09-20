import React, { createContext, useEffect, useRef } from 'react';

import { EventData } from 'app/src/components/BoardCalendarView/types';
import { TimelineItem } from 'app/src/components/TimelineGrid/types';

import { getUpdatedDateRange } from './helpers';
import { SelectedEventData } from './types';
import {
  DraggableState,
  initialDraggableState,
  useDraggableReducer,
} from './useDraggableReducer';

interface DraggableContextState {
  draggableState: DraggableState;
  handleBeginDrag: (eventData: SelectedEventData, x: number, y: number) => void;
  handleDragging: (x: number, y: number) => void;
  handleEndDrag: (eventData: SelectedEventData, x: number, y: number) => void;
  handleCancelDrag: (eventData: SelectedEventData) => void;
}

export const DraggableContext = createContext<DraggableContextState>({
  draggableState: initialDraggableState,
  handleBeginDrag() {},
  handleDragging() {},
  handleEndDrag() {},
  handleCancelDrag() {},
});

interface DraggableContextProviderProps {
  getDateSlot: (
    x: number,
    y: number,
  ) => {
    date: Date | null;
    isMultiDaySlot?: boolean;
    groupId?: string;
    updateDayOnly?: boolean;
    isUnscheduled?: boolean;
    resetToOriginal?: boolean;
  };
  onEndDrag?: ({
    event,
    start,
    end,
    groupId,
  }: {
    event: EventData | TimelineItem;
    start: Date;
    end: Date;
    groupId?: string;
    isUnscheduled?: boolean;
  }) => void;
  onCancelDrag?: ({
    event,
    groupId,
  }: {
    event: EventData | TimelineItem;
    groupId?: string;
  }) => void;
}

export const DraggableContextProvider: React.FC<DraggableContextProviderProps> = ({
  getDateSlot,
  onEndDrag,
  onCancelDrag,
  children,
}) => {
  const { state, dispatch } = useDraggableReducer();

  const originalSlotRef = useRef(state.originalSlot);
  useEffect(() => {
    originalSlotRef.current = state.originalSlot;
  }, [state.originalSlot]);

  const currentSlotRef = useRef(state.currentSlot);
  useEffect(() => {
    currentSlotRef.current = state.currentSlot;
  }, [state.currentSlot]);

  const originalSlotIsMultiDayRef = useRef(state.originalSlotIsMultiDay);
  useEffect(() => {
    originalSlotIsMultiDayRef.current = state.originalSlotIsMultiDay;
  }, [state.originalSlotIsMultiDay]);

  const handleBeginDrag = (
    eventData: SelectedEventData,
    initialX: number,
    initialY: number,
  ) => {
    const {
      date: originalSlot,
      isMultiDaySlot,
      groupId,
      isUnscheduled,
    } = getDateSlot(initialX, initialY);

    dispatch({
      type: 'begin_drag',
      payload: {
        draggedEventData: eventData,
        originalSlot,
        isMultiDaySlot,
        groupId,
        isUnscheduled,
      },
    });
  };

  const handleDragging = (x: number, y: number) => {
    const {
      date: currentSlot,
      isMultiDaySlot,
      groupId,
      isUnscheduled,
      updateDayOnly,
      resetToOriginal,
    } = getDateSlot(x, y);

    dispatch({
      type: 'handle_dragging',
      payload: {
        currentSlot,
        isMultiDaySlot,
        groupId,
        updateDayOnly,
        isUnscheduled,
        resetToOriginal,
      },
    });
  };

  const handleEndDrag = (
    eventData: SelectedEventData,
    x: number,
    y: number,
  ) => {
    const {
      date,
      isMultiDaySlot,
      groupId,
      isUnscheduled,
      updateDayOnly,
      resetToOriginal,
    } = getDateSlot(x, y);
    let currentSlot = date;

    // Use the last recorded slot if either:
    // - We end the drag on a place that is not a date slot
    // - We're trying to drag between the all day section
    // and the hour section
    if (!currentSlot || originalSlotIsMultiDayRef.current !== isMultiDaySlot) {
      currentSlot = currentSlotRef.current;
    }

    if (
      !resetToOriginal &&
      onEndDrag &&
      // Only call onEndDrag if we ended on a different slot
      currentSlot &&
      originalSlotRef.current &&
      currentSlot.getTime() !== originalSlotRef.current.getTime()
    ) {
      const { start, end } = getUpdatedDateRange(
        currentSlot,
        originalSlotRef.current,
        eventData,
        { updateDayOnly },
      ) as { start: Date; end: Date };

      onEndDrag({
        event: eventData.originalEvent,
        start,
        end,
        groupId,
        isUnscheduled,
      });
    }

    dispatch({ type: 'end_drag' });
  };

  const handleCancelDrag = (eventData: SelectedEventData) => {
    if (onCancelDrag) {
      onCancelDrag({ event: eventData.originalEvent });
    }
    dispatch({ type: 'end_drag' });
  };

  return (
    <DraggableContext.Provider
      value={{
        draggableState: state,
        handleBeginDrag,
        handleDragging,
        handleEndDrag,
        handleCancelDrag,
      }}
    >
      {children}
    </DraggableContext.Provider>
  );
};
