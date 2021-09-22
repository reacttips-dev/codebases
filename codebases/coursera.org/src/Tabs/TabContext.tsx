import React, { Context } from 'react';

import { useId } from '@core/utils';

export type Props = {
  /**
   * The value of the currently selected `Tab`.
   */
  value: string;
  /**
   * The content of the component.
   */
  children?: React.ReactNode;
};

type Id = string | undefined;
type TabContextType = {
  id: Id;
  value: string;
} | null;

const Context = React.createContext<TabContextType>(null);

/**
 * See [Tabs](__storybookUrl__/navigation-tabs--default)
 */
export const TabContext = ({
  children,
  value,
}: Props): React.ReactElement<Props> => {
  const id = useId();

  const context = React.useMemo(() => {
    return { id, value };
  }, [id, value]);

  return <Context.Provider value={context}>{children}</Context.Provider>;
};

export const useTabContext = (): TabContextType => {
  return React.useContext(Context);
};

export const getPanelId = (context: TabContextType, value: Id): Id => {
  if (!context?.id) {
    return undefined;
  }

  return `${context.id}-panel-${value}`;
};

export const getTabId = (context: TabContextType, value: Id): Id => {
  if (!context?.id) {
    return undefined;
  }

  return `${context.id}-tab-${value}`;
};

export default TabContext;
