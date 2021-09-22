import React, { MouseEvent, FocusEvent } from 'react';

type HeaderRef = React.Ref<HTMLButtonElement>;

export type AccordionContextType = {
  expanded: boolean;
  onToggleExpanded?: React.MouseEventHandler<HTMLElement>;
  onHoverChange?: (event: MouseEvent<HTMLElement>, hovering: boolean) => void;
  onFocusChange?: (event: FocusEvent<HTMLElement>, focused: boolean) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
  headerRef?: HeaderRef;
} | null;

const AccordionContext = React.createContext<AccordionContextType>(null);

export const useAccordionContext = (): AccordionContextType => {
  return React.useContext(AccordionContext);
};

type Props = {
  children?: React.ReactNode | React.ReactNode[];
} & AccordionContextType;

const AccordionContextProvider = (
  props: Props
): React.ReactElement<{ value: AccordionContextType }> => {
  const {
    children,
    expanded,
    onToggleExpanded,
    onFocusChange,
    onHoverChange,
    onKeyDown,
    headerRef,
  } = props;

  const context = React.useMemo(() => {
    return {
      expanded,
      headerRef,
      onToggleExpanded,
      onFocusChange,
      onHoverChange,
      onKeyDown,
    };
  }, [
    expanded,
    headerRef,
    onToggleExpanded,
    onFocusChange,
    onHoverChange,
    onKeyDown,
  ]);

  return (
    <AccordionContext.Provider value={context}>
      {children}
    </AccordionContext.Provider>
  );
};

export default AccordionContextProvider;
