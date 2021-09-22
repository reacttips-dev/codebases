import React from 'react';
import PropTypes from 'prop-types';

import type UserAgentInfo from 'js/lib/useragent';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import FluxibleComponent from 'vendor/cnpm/fluxible.v0-4/addons/FluxibleComponent';
import { applicationStoreIn, naptimeStoreIn } from 'bundles/page/lib/migration';
import PageHeaderApp from 'bundles/page/PageHeaderApp';

import type { FluxibleContext } from 'fluxible';

import type {
  PropsFromCaller as DesktopHeaderControlsProps,
} from 'bundles/page/components/header/desktop/DesktopHeaderControls';
import DesktopHeaderControls from 'bundles/page/components/header/desktop/DesktopHeaderControls';

class DesktopHeader extends React.Component<DesktopHeaderControlsProps & { userAgent: UserAgentInfo }> {
  fluxibleContext!: FluxibleContext;

  static contextTypes = {
    getStore: PropTypes.func,
  };

  componentWillMount() {
    if (!(applicationStoreIn(this) && naptimeStoreIn(this))) {
      this.fluxibleContext = PageHeaderApp.createContext();
    }
  }

  render() {
    if (this.fluxibleContext) {
      const context = this.fluxibleContext.getComponentContext();
      return (
        <FluxibleComponent context={context}>
          <DesktopHeaderControls {...this.props} />
        </FluxibleComponent>
      );
    } else {
      return <DesktopHeaderControls {...this.props} />;
    }
  }
}

export default DesktopHeader;
