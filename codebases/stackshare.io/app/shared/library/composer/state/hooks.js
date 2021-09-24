import {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {ChecklistContext, SHARED_DECISION} from '../../../enhancers/checklist-enhancer';
import {scrollIntoView} from '../../../utils/scroll';

export const useLayoutHeight = (ref, triggers) => {
  const [height, setHeight] = useState(0);
  useLayoutEffect(() => setHeight(ref && ref.current ? ref.current.offsetHeight : 0), triggers);
  return height;
};

export const useLayoutWidth = (ref, triggers) => {
  const [width, setWidth] = useState(900);
  if (typeof window !== 'undefined') {
    useLayoutEffect(() => setWidth(ref && ref.current ? ref.current.offsetWidth : 0), triggers);
  }
  return width;
};

export const useChecklistAction = (scrollTarget, onFocus) => {
  const checklistContext = useContext(ChecklistContext);
  useEffect(() => {
    const {checklistAction, resetChecklistAction} = checklistContext;
    if (checklistAction === SHARED_DECISION) {
      resetChecklistAction && resetChecklistAction();
      scrollIntoView(document.documentElement, scrollTarget.current, 100, 1000, () => {
        onFocus();
      });
    }
  }, [checklistContext]);
};
