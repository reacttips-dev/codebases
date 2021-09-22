import React, { Context } from 'react';

export type Props = {
  /**
   * The content of the component.
   */
  children?: React.ReactNode;
};

/**
 * Context for children - PageNotification to flag if they are stacked or not.
 * PageNotification component renders title as `h3` if stacked otherwise `h2`.
 */
const Context = React.createContext<boolean | undefined>(undefined);

const NotificationListContext = ({
  children,
}: Props): React.ReactElement<Props> => (
  <Context.Provider value={true}>{children}</Context.Provider>
);

export const useNotificationListContext = (): boolean | undefined => {
  return React.useContext(Context);
};

export default NotificationListContext;
