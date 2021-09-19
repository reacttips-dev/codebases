import React, { useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import cn from 'classnames';

import { track } from 'apis/amethyst';
import { mod, noop } from 'helpers/index';
import useClientGuid from 'hooks/useClientGuid';
import useMartyContext from 'hooks/useMartyContext';
import { evProductAccordionEvent } from 'events/symphony';

import css from 'styles/components/common/melodyAccordion.scss';

/**
 * Parent-level accordion state houses just one item, a `Set` of all currently opened/active accordion panels, handled via `useReducer`
 * This can be configurable via a prop to the `Accordion` parent, `openMultiple`.
 * When this is `false` (by default), only one panel can be opened at any time. Therefore, this set will always contain either 0 or 1 elements.
 * When this is `true`, the set can contain numbers up to/inclusive of the number of child `AccordionItem` panels.
 */
interface State {
  openedPanels: Set<number>;
}

const OPEN_PANEL_AND_CLOSE_OTHERS = 'OPEN_PANEL_AND_CLOSE_OTHERS';
const TOGGLE_PANEL = 'TOGGLE_PANEL';
type OpenPanelType = { type: typeof OPEN_PANEL_AND_CLOSE_OTHERS; payload: { panelIndex: number; heading: string | null }};
type TogglePanelType = { type: typeof TOGGLE_PANEL; payload: { panelIndex: number; heading: string | null }};
type AccordionActionType =
| OpenPanelType
| TogglePanelType;

const openSingle = (panelIndex: number, heading: string | null): OpenPanelType => ({
  type: OPEN_PANEL_AND_CLOSE_OTHERS,
  payload: { panelIndex, heading }
});

const toggle = (panelIndex: number, heading: string): TogglePanelType => ({
  type: TOGGLE_PANEL,
  payload: { panelIndex, heading }
});

const trackAccordionEvent = (opened: boolean, headerName: string | null) => {
  if (!headerName) {
    return;
  }
  track(() => ([evProductAccordionEvent, { opened, closed: !opened, headerName }]));
};

const reducer = (state: Readonly<State>, action: AccordionActionType): State => {
  switch (action.type) {
    case OPEN_PANEL_AND_CLOSE_OTHERS: {
      const { openedPanels } = state;
      const { payload } = action;
      const { panelIndex, heading } = payload;
      const newPanels = new Set(openedPanels);

      if (newPanels.has(panelIndex)) {
        newPanels.delete(panelIndex);
        trackAccordionEvent(false, heading);
      } else {
        newPanels.clear();
        newPanels.add(panelIndex);
        trackAccordionEvent(true, heading);
      }
      return { ...state, openedPanels : newPanels };
    }
    case TOGGLE_PANEL: {
      const { openedPanels } = state;
      const { payload } = action;
      const { panelIndex, heading } = payload;
      const newPanels = new Set(openedPanels);

      if (newPanels.has(panelIndex)) {
        newPanels.delete(panelIndex);
        trackAccordionEvent(false, heading);
      } else {
        newPanels.add(panelIndex);
        trackAccordionEvent(true, heading);
      }
      return { ...state, openedPanels : newPanels };
    }
    default: {
      return state;
    }
  }
};

/**
 * The AccordionContext provides child `AccordionItem` components some necessary information/utilities.
 * `openPanel` provides a memoized callback, opening the panel. Subsequent repercussions (such as closing other open panels, etc) are abstracted away in the parent
 *
 * `openedPanels` is a set of indexes of all opened panels. A panel can be determined as 'open' if their internal index prop exists in this set.
 *
 * `registerAccordionItemElement` will "register" each `AccordionItem` in a `Map`, where the key is the index position, and the value is a reference to the internal DOM node
 * This allows the parent component to imperitively adjust things like focus, again abstracting away implementation details from the child.
 */
type AccordionContextType = {
  openPanel: (index: number, heading: string) => void;
  openedPanels: Set<number>;
  registerAccordionItemElement: (index: number, element: React.RefObject<HTMLButtonElement>) => void;
  uniqueId: string | undefined;
};

const AccordionContext = React.createContext<AccordionContextType>({
  openPanel: noop,
  openedPanels: new Set<number>(),
  registerAccordionItemElement: noop,
  uniqueId: ''
});

interface AccordionProps {
  openMultiple?: boolean;
  defaultOpenIndex?: number;
  children: React.ReactElement<AccordionItemProps> | React.ReactElement<AccordionItemProps>[];
}

export const Accordion = ({ openMultiple = false, children, defaultOpenIndex }: AccordionProps) => {
  const [state, dispatch] = useReducer(reducer, { openedPanels: new Set<number>() });
  const { openedPanels } = state;
  const itemList = useRef<Map<number, React.RefObject<HTMLButtonElement>>>(new Map());
  const registerAccordionItemElement = useCallback((index: number, element: React.RefObject<HTMLButtonElement>) => void itemList.current.set(index, element), []);
  const accordionItemCount = useMemo(() => React.Children.count(children), [children]);
  const uniqueId = useClientGuid();
  const openPanel = useCallback((panelIndex: number, heading: string) => {
    if (openMultiple) {
      dispatch(toggle(panelIndex, heading));
    } else {
      dispatch(openSingle(panelIndex, heading));
    }
  }, [openMultiple]);

  /* This helper focuses the next element from a given delta, in a cyclic pattern */
  const focusNext = useCallback((indexDelta: number) => {
    const currentItem = document.activeElement;
    if (currentItem) {
      let currentIndex: number | undefined;
      for (const [key, el] of itemList.current.entries()) {
        if (currentItem === el.current) {
          currentIndex = key;
          break;
        }
      }
      if (typeof currentIndex !== 'undefined') {
        const indexToFocus = mod(currentIndex + indexDelta, accordionItemCount);
        const nextElementToFocus = itemList.current.get(indexToFocus);
        nextElementToFocus?.current?.focus();
      }
    }
  }, [accordionItemCount]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    /**
     * In order to adhere to WCAG a11y guidelines, the following patterns must be upheld:
     *
     * - Focus via `tab`/`shift + tab` adhere to the regular focus order (nothing for us to do here)
     * - Pressing the `Home` key results in the first panel being focused
     * - Pressing the `End` key results in the last panel being focused
     * - Pressing the `ArrowDown` key focuses the next accordion panel. If the currently focused panel is the last, focus is placed on the first
     * - Pressing the `ArrowUp` key focuses the previous accordion panel. If the currently focused panel is the first, focus is returned to the last
     */
    const { key } = e;

    switch (key) {
      case 'Home': {
        e.preventDefault();
        const firstItem = itemList.current.get(0);
        firstItem?.current?.focus();
        break;
      }
      case 'End': {
        e.preventDefault();
        const lastItem = itemList.current.get(accordionItemCount - 1);
        lastItem?.current?.focus();
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        focusNext(-1);
        break;
      }
      case 'ArrowDown': {
        e.preventDefault();
        focusNext(1);
        break;
      }
    }
  };

  /**
   * If there is a default index to open, open it
   */
  useEffect(() => {
    if (typeof defaultOpenIndex === 'number') {
      dispatch(openSingle(defaultOpenIndex, null));
    }
  }, [defaultOpenIndex]);

  const contextValue = useMemo(() => ({
    openPanel,
    openedPanels,
    registerAccordionItemElement,
    uniqueId
  }), [openPanel, openedPanels, registerAccordionItemElement, uniqueId]);
  return (
    <AccordionContext.Provider value={contextValue}>
      <div
        role="presentation"
        onKeyDown={handleKeyDown}
      >
        {/* Inject an `index` prop to each `AccordionItem` child, to allow correct opening/closing while still maintaining state in the parent */}
        {React.Children.map(children, (child, index) => React.cloneElement(child, { index }))}
      </div>
    </AccordionContext.Provider>
  );
};
/**
 * `innerRef` allows a ref for the header button of the accordion
 */
export interface AccordionItemProps {
  children: React.ReactNode;
  heading: string;
  index?: number;
  innerRef?: React.RefObject<any>;
  accordionTestId?: string;
}

export const AccordionItem = (props: AccordionItemProps) => {
  const { children, heading, index, innerRef, accordionTestId } = props;
  const { openedPanels, openPanel, registerAccordionItemElement, uniqueId } = useContext(AccordionContext);

  const isOpen = typeof index !== 'undefined' && openedPanels.has(index);
  const headingId = `heading-${index}-${uniqueId}`;
  const contentId = `content-${index}-${uniqueId}`;

  const { testId } = useMartyContext();

  function makeAccordionHeaderTestId(section?: string) {
    if (section) {
      return testId(`accordionHeader${section}Button`);
    }
    return null;
  }

  const accordionHeaderRef = React.createRef<HTMLButtonElement>();

  if (accordionHeaderRef && typeof index !== 'undefined') {
    registerAccordionItemElement(index, innerRef ? innerRef : accordionHeaderRef);
  }

  return (
    <div className={css.accordionRegionContainer}>
      <h3
        className={css.heading}
      >
        <button
          type="button"
          ref={innerRef ? innerRef : accordionHeaderRef}
          className={cn(css.headingButton, isOpen ? css.headingButtonUpArrow : css.headingButtonDownArrow)}
          onClick={() => typeof index !== 'undefined' && openPanel(index, heading)}
          aria-controls={contentId}
          aria-expanded={isOpen}
          id={headingId}
          data-test-id={makeAccordionHeaderTestId(accordionTestId)}
        >
          {heading}
        </button>
      </h3>
      <div
        role="region"
        aria-labelledby={headingId}
        className={cn(css.accordionRegion, { [css.expanded]: isOpen })}
        id={contentId}
        hidden={!isOpen}
      >
        {children}
      </div>
    </div>
  );
};
