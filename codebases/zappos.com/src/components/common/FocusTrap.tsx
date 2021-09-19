import React from 'react';

import useFocusTrap from 'hooks/useFocusTrap';

interface Props {
  children: (ref: React.MutableRefObject<HTMLElement | null>) => React.ReactNode;
  shouldFocusFirstElement?: boolean;
  active?: boolean;
}
const FocusTrap = ({ children, shouldFocusFirstElement, active }: Props) => {
  const ref = useFocusTrap({ shouldFocusFirstElement, active });
  return (
    <>
      {children(ref)}
    </>
  );
};

export default FocusTrap;
