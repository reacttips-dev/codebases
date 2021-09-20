/* eslint-disable @typescript-eslint/no-use-before-define */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import cx from 'classnames';

import { numberOfDaysSpanned } from 'app/src/components/BoardCalendarView/helpers';

import { DraggableContext } from './DraggableContext';
import { isClick } from './helpers';
import { SelectedEventData } from './types';
import { useDraggableItemReducer } from './useDraggableItemReducer';

import styles from './DraggableItemWrapper.less';

interface DraggableItemWrapperProps {
  eventData: SelectedEventData;
  className?: string;
  scrollContainer?: HTMLDivElement | null;
  renderChildren?: (
    children: React.ReactElement,
    isBeingDragged: boolean,
  ) => React.ReactElement;
  useMiniCardDrag?: boolean;
}

export const DraggableItemWrapper: React.FC<DraggableItemWrapperProps> = ({
  eventData,
  className,
  scrollContainer,
  renderChildren,
  useMiniCardDrag,
  children,
}) => {
  const {
    draggableState,
    handleBeginDrag,
    handleDragging,
    handleEndDrag,
    handleCancelDrag,
  } = useContext(DraggableContext);

  const { state, dispatch } = useDraggableItemReducer();

  // Need to set the ref so the event listeners will have
  // access to the updated value for `isBeingDragged`
  const isBeingDraggedRef = useRef(state.isBeingDragged);

  useEffect(() => {
    isBeingDraggedRef.current = state.isBeingDragged;
  }, [state.isBeingDragged]);

  const useMiniCard = useMemo(() => {
    if (useMiniCardDrag) {
      return true;
    }
    if (eventData.start === null) {
      return false;
    }
    if (eventData.end === null) {
      return false;
    }
    if (eventData.duration) {
      return eventData.duration > 1;
    }
    return numberOfDaysSpanned(eventData.start, eventData.end) > 1;
  }, [useMiniCardDrag, eventData.end, eventData.start, eventData.duration]);

  const handleMouseDown = useCallback(
    (mouseDownEvent: React.MouseEvent) => {
      mouseDownEvent.stopPropagation();
      mouseDownEvent.preventDefault();

      // Ignore right clicks
      if (mouseDownEvent.button === 2) {
        return;
      }
      const { clientX: initialX, clientY: initialY } = mouseDownEvent;

      let initialDeltaX = 0,
        initialDeltaY = 0,
        currentX = initialX,
        currentY = initialY;

      if (draggableItemRef.current) {
        if (useMiniCard) {
          // Half the height of .miniCard
          initialDeltaY = 7;
        } else {
          const rect = draggableItemRef.current.getBoundingClientRect();
          initialDeltaX = initialX - rect.left;
          initialDeltaY = initialY - rect.top;
        }
      }

      const handleMouseMove = (mouseMoveEvent: MouseEvent) => {
        const { clientX: mouseX, clientY: mouseY } = mouseMoveEvent;

        if (!isClick(mouseX, mouseY, initialX, initialY)) {
          if (!isBeingDraggedRef.current) {
            dispatch({
              type: 'begin_item_drag',
              payload: {
                initialDeltaX,
                initialDeltaY,
                mouseX,
                mouseY,
              },
            });

            handleBeginDrag(eventData, initialX, initialY);
          }

          dispatch({
            type: 'update_mouse_position',
            payload: { mouseX, mouseY },
          });

          handleDragging(mouseX, mouseY);

          currentX = mouseX;
          currentY = mouseY;
        }
      };

      const handleScroll = () => {
        handleDragging(currentX, currentY);
      };

      const handleMouseUp = (mouseUpEvent: MouseEvent) => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        scrollContainer?.removeEventListener('scroll', handleScroll);
        document.removeEventListener('keydown', handleKeyDown);
        if (isBeingDraggedRef.current) {
          const { clientX: mouseX, clientY: mouseY } = mouseUpEvent;

          dispatch({ type: 'end_item_drag' });

          handleEndDrag(eventData, mouseX, mouseY);
        }
      };
      const handleKeyDown = (keydownEvent: KeyboardEvent) => {
        if (keydownEvent.key === 'Escape') {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
          document.removeEventListener('keydown', handleKeyDown);
          scrollContainer?.removeEventListener('scroll', handleScroll);
          if (isBeingDraggedRef.current) {
            dispatch({ type: 'cancel_item_drag' });
            handleCancelDrag(eventData);
          }
        }
      };

      document.addEventListener('mousemove', handleMouseMove);
      scrollContainer?.addEventListener('scroll', handleScroll);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('keydown', handleKeyDown);
    },
    [
      dispatch,
      eventData,
      handleBeginDrag,
      handleCancelDrag,
      handleDragging,
      handleEndDrag,
      scrollContainer,
      useMiniCard,
    ],
  );

  const draggableItemRef = useRef<HTMLDivElement>(null);

  const {
      initialDeltaX,
      initialDeltaY,
      mouseX,
      mouseY,
      isBeingDragged,
    } = state,
    { draggedEventData, isDragging } = draggableState;

  const classNames = useMemo(() => {
    const classNames = [];

    if (isDragging) {
      if (isBeingDragged) {
        classNames.push(styles.isBeingDragged);

        if (useMiniCard) {
          classNames.push(styles.miniCard);
        }
      } else {
        classNames.push(styles.isDragging);
      }
    }
    return classNames;
  }, [isDragging, isBeingDragged, useMiniCard]);

  const draggableAnchorRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cx(
        styles.dragAnchorContainer,
        isDragging &&
          draggedEventData &&
          draggedEventData.id === eventData.id &&
          styles.isDraggedAnchor,
        className,
      )}
      ref={draggableAnchorRef}
    >
      <div
        className={cx(styles.draggableItemContainer, classNames)}
        onMouseDown={handleMouseDown}
        ref={draggableItemRef}
        role="button"
        style={
          isBeingDragged
            ? {
                left: mouseX - initialDeltaX,
                top: mouseY - initialDeltaY,
                width: draggableAnchorRef.current?.clientWidth,
                height: draggableAnchorRef.current?.clientHeight,
              }
            : {}
        }
      >
        <div className={styles.draggableContent}>
          {renderChildren && React.isValidElement(children)
            ? renderChildren(
                children,
                !!(
                  isDragging &&
                  draggedEventData &&
                  draggedEventData.id === eventData.id
                ),
              )
            : children}
        </div>
      </div>
    </div>
  );
};
