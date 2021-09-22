/**
 * Implementation from https://github.com/mui-org/material-ui/blob/v4.11.2/packages/material-ui-styles/src/ServerStyleSheets/ServerStyleSheets.js
 * Need custom implementation to have a custom classname generator for SSR (similar to @core/theme/StylesProvider.tsx)
 */
import React from 'react';

import { StylesProvider } from '@material-ui/core/styles';

import { SheetsRegistry } from 'jss';

import createGenerateClassName from '@core/theme/createGenerateClassName';
import createJss from '@core/theme/createJss';

export default class ServerStyleSheets {
  options: Record<string, unknown>;
  sheetsRegistry?: SheetsRegistry;

  constructor(options = {}) {
    this.options = options;
  }

  collect(children: React.ReactNode): React.ReactNode {
    // This is needed in order to deduplicate the injection of CSS in the page.
    const sheetsManager = new Map();
    // This is needed in order to inject the critical CSS.
    this.sheetsRegistry = new SheetsRegistry();

    const jss = createJss();
    const serverGenerateClassName = createGenerateClassName();

    return (
      <StylesProvider
        jss={jss}
        /* @see https://github.com/mui-org/material-ui/blob/v4.11.2/packages/material-ui-styles/src/StylesProvider/StylesProvider.js#L108 */
        /* @ts-ignore: Prop exists but it is ignored in type definition */
        serverGenerateClassName={serverGenerateClassName}
        sheetsManager={sheetsManager}
        sheetsRegistry={this.sheetsRegistry}
        {...this.options}
      >
        {children}
      </StylesProvider>
    );
  }

  toString(): string {
    return this.sheetsRegistry ? this.sheetsRegistry.toString() : '';
  }

  getStyleElement(props: Record<string, unknown>): React.ReactNode {
    return React.createElement('style', {
      id: 'jss-server-side',
      key: 'jss-server-side',
      dangerouslySetInnerHTML: { __html: this.toString() },
      ...props,
    });
  }
}
