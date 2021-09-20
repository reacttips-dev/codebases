import { useReducer } from 'react';

type DraggableItemAction =
  | {
      type: 'begin_item_drag';
      payload: {
        initialDeltaX: number;
        initialDeltaY: number;
        mouseX: number;
        mouseY: number;
      };
    }
  | {
      type: 'update_mouse_position';
      payload: { mouseX: number; mouseY: number };
    }
  | {
      type: 'end_item_drag';
    }
  | {
      type: 'cancel_item_drag';
    };

interface DraggableItemState {
  isBeingDragged: boolean;
  isMultiDayEvent: boolean;
  initialDeltaX: number;
  initialDeltaY: number;
  mouseX: number;
  mouseY: number;
}

const initialState = {
  isBeingDragged: false,
  initialDeltaX: 0,
  initialDeltaY: 0,
  mouseX: 0,
  mouseY: 0,
} as DraggableItemState;

const draggableItemReducer = (
  state: DraggableItemState,
  action: DraggableItemAction,
) => {
  switch (action.type) {
    case 'begin_item_drag':
      return {
        ...state,
        isBeingDragged: true,
        initialDeltaX: action.payload.initialDeltaX,
        initialDeltaY: action.payload.initialDeltaY,
        mouseX: action.payload.mouseX,
        mouseY: action.payload.mouseY,
      };
    case 'update_mouse_position':
      return {
        ...state,
        mouseX: action.payload.mouseX,
        mouseY: action.payload.mouseY,
      };
    case 'end_item_drag':
      return initialState;
    case 'cancel_item_drag':
      return initialState;
    default:
      return state;
  }
};

export const useDraggableItemReducer = () => {
  const [state, dispatch] = useReducer(draggableItemReducer, initialState);

  return {
    state,
    dispatch,
  };
};
