import React from 'react';

export type CheckboxGroupValue = React.ReactText[];

type CheckboxGroupContextValue = {
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
  value?: CheckboxGroupValue;
};

const Context = React.createContext<CheckboxGroupContextValue | undefined>(
  undefined
);

Context.displayName = 'CheckboxGroupContext';

const CheckboxGroupProvider = Context.Provider;

const useCheckboxGroupContext = (): CheckboxGroupContextValue | undefined => {
  return React.useContext(Context);
};

export { useCheckboxGroupContext, CheckboxGroupProvider };
