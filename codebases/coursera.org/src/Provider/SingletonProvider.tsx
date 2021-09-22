import React, { useContext } from 'react';

export const SingletonContext = React.createContext<number>(0);
SingletonContext.displayName = 'SingletonContext';

type Props = {
  children: React.ReactNode;
};

/**
 * Allows enforcing a single instance of Provider in the react component tree
 * by providing the number of instances of the component already in the tree
 */
const SingletonProvider = ({ children }: Props): JSX.Element => {
  const parent = useContext(SingletonContext);

  if (__DEV__) {
    if (parent > 0) {
      console.error(
        'Nested usage of <Provider /> is not supported. <Provider /> is already an ancestor.'
      );
    }
  }

  return (
    <SingletonContext.Provider value={parent + 1}>
      {children}
    </SingletonContext.Provider>
  );
};

export default SingletonProvider;
