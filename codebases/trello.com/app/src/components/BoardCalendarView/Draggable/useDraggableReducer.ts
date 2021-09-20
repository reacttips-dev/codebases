import { useReducer } from 'react';

import { constructDate, getUpdatedDateRange } from './helpers';
import { SelectedEventData } from './types';

type DraggableAction =
  | {
      type: 'begin_drag';
      payload: {
        draggedEventData: SelectedEventData;
        originalSlot: Date | null;
        isMultiDaySlot?: boolean;
        groupId?: string;
        isUnscheduled?: boolean;
      };
    }
  | {
      type: 'handle_dragging';
      payload: {
        currentSlot: Date | null;
        isMultiDaySlot?: boolean;
        groupId?: string;
        updateDayOnly?: boolean;
        isUnscheduled?: boolean;
        resetToOriginal?: boolean;
      };
    }
  | {
      type: 'end_drag';
    };

export interface DraggableState {
  isDragging: boolean;
  draggedEventData: SelectedEventData | null;
  // originalSlot is the date cell where the drag action was
  // initiated
  originalSlot: Date | null;
  // currentSlot is the date cell where the mouse is currently
  // hovering
  currentSlot: Date | null;
  originalSlotIsMultiDay?: boolean;
  // Need to record currentSlotIsMultiDay to distinguish between
  // the multi day slot and 12:00 AM slot (which have the same value)
  // NOTE: we might not need this since we aren't allowing
  // dragging between multi-day section and hour section
  currentSlotIsMultiDay?: boolean;
  // highlightedDateRange is the range of dates where the
  // drag action is currently affecting
  highlightedDateRange: {
    start: Date | null;
    end: Date | null;
  };
  groupId: string | undefined;
  isUnscheduled: boolean | undefined;
}

export const initialDraggableState = {
  isDragging: false,
  draggedEventData: null,
  originalSlot: null,
  currentSlot: null,
  originalSlotIsMultiDay: false,
  currentSlotIsMultiDay: false,
  highlightedDateRange: {
    start: null,
    end: null,
  },
  groupId: undefined,
} as DraggableState;

const draggableReducer = (state: DraggableState, action: DraggableAction) => {
  switch (action.type) {
    case 'begin_drag': {
      const {
        draggedEventData,
        isMultiDaySlot,
        originalSlot,
        groupId,
        isUnscheduled,
      } = action.payload;

      // TODO This shouldn't happen, so we should track it
      if (!originalSlot) {
        return state;
      }

      return {
        ...state,
        isDragging: true,
        draggedEventData,
        originalSlot,
        currentSlot: originalSlot,
        originalSlotIsMultiDay: isMultiDaySlot,
        currentSlotIsMultiDay: isMultiDaySlot,
        highlightedDateRange: getUpdatedDateRange(
          originalSlot,
          originalSlot,
          draggedEventData,
          { shouldNotReturnRange: !isMultiDaySlot },
        ),
        groupId,
        isUnscheduled,
      };
    }
    case 'handle_dragging': {
      const {
        currentSlot,
        isMultiDaySlot,
        groupId,
        isUnscheduled,
        updateDayOnly,
        resetToOriginal,
      } = action.payload;
      const {
        draggedEventData,
        originalSlot,
        currentSlot: previousSlot,
        originalSlotIsMultiDay,
        groupId: previousGroupId,
      } = state;

      if (draggedEventData && originalSlot) {
        // NOTE: Right now, you can only drag hour events
        // to the "panel" calendar, we may add the ability
        // to drag multi-day events too
        if (updateDayOnly) {
          if (currentSlot) {
            return {
              ...state,
              currentSlot: constructDate(originalSlot, currentSlot),
              highlightedDateRange: { start: null, end: null },
              groupId,
              isUnscheduled,
            };
          } else {
            return state;
          }
        }

        // Revert the slot to original if either:
        // - We're trying to drag between the all day section
        // and the hour section
        // - `resetToOriginal` is true
        // AND the previousSlot is not the originalSlot
        if (
          ((typeof isMultiDaySlot === 'boolean' &&
            isMultiDaySlot !== originalSlotIsMultiDay) ||
            resetToOriginal) &&
          previousSlot !== originalSlot
        ) {
          return {
            ...state,
            currentSlot: originalSlot,
            highlightedDateRange: getUpdatedDateRange(
              originalSlot,
              originalSlot,
              draggedEventData,
              { shouldNotReturnRange: !originalSlotIsMultiDay },
            ),
            groupId,
            isUnscheduled,
          };
        }

        if (currentSlot && originalSlotIsMultiDay === isMultiDaySlot) {
          // Only calculate new dates if this is the first
          // date slot recorded or this slot is different
          // from the original slot
          if (
            !previousSlot ||
            previousSlot.getTime() !== currentSlot.getTime() ||
            groupId !== previousGroupId
          ) {
            return {
              ...state,
              currentSlot,
              highlightedDateRange: getUpdatedDateRange(
                currentSlot,
                originalSlot,
                draggedEventData,
                {
                  shouldNotReturnRange: !originalSlotIsMultiDay,
                },
              ),
              groupId,
              isUnscheduled,
            };
          }
        }
      }

      return state;
    }
    case 'end_drag': {
      return initialDraggableState;
    }
    default: {
      return state;
    }
  }
};

export const useDraggableReducer = () => {
  const [state, dispatch] = useReducer(draggableReducer, initialDraggableState);

  return {
    state,
    dispatch,
  };
};
