import React from 'react';

import { StylesProvider as MuiStylesProvider } from '@material-ui/core/styles';

import createGenerateClassName from '@core/theme/createGenerateClassName';
import createJss from '@core/theme/createJss';

const StylesProvider: React.FC = ({ children }) => {
  if (typeof window === 'undefined') {
    return <>{children}</>;
  }

  const injectFirstNode = document.createComment('cds-jss-injection-point');
  document.head.insertBefore(injectFirstNode, document.head.firstChild);

  const jss = createJss({
    insertionPoint: injectFirstNode,
  });

  const generateClassName = createGenerateClassName();

  return (
    <MuiStylesProvider generateClassName={generateClassName} jss={jss}>
      {children}
    </MuiStylesProvider>
  );
};

export default StylesProvider;
