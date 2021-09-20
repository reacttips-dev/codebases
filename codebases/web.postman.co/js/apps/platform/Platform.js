import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { PageService } from '../../../appsdk/services/PageService';

import SignedOutHeader from './header/SignedOutHeaderContainer';
import classnames from 'classnames';
import AppSettingsDefaults from '../../constants/AppSettingsDefaults';
import { isHomePageActive } from '../../../onboarding/src/features/Homepage/utils';
import { SEARCH } from '../../navigation/active-mode/constants';
import { isResponsivePage } from '../../utils/LayoutHelper';
import NotificationSystem from 'react-notification-system';

import AppNotificationStyles from '../../constants/AppNotificationStyles';
import KeyMaps from '../../components/base/keymaps/KeyMaps';
import { Spinner } from '@postman/aether';

const StyledSpinnerContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
`;

// @DragDropContext(HTML5Backend)
@observer
class Platform extends React.Component {

  constructor () {
    super();
    this.renderPage = this.renderPage.bind(this);

    this.renderHeader = this.renderHeader.bind(this);
  }

  componentDidMount () {

  }

  renderHeader () {
    let header = PageService.activePageHeader;

    // TODO fix header
    return header && header.hide ? null : <SignedOutHeader />;
  }

  renderPage () {
    let View = PageService.activePageView,
      activePageController = PageService.activePageController;

    if (!View || !activePageController) {
      return <StyledSpinnerContainer><Spinner /></StyledSpinnerContainer>;
    }

    return (
      <View
        controller={activePageController}
      />
    );
  }

  getKeyMapHandlers () {
    return {
      universalSearchFocus: pm.shortcuts.handle('universalSearchFocus')
    };
  }

  render () {
    const isLoggedIn = window.USER_ID !== '0',
      isSRPActive = PageService.activePageName === SEARCH;
    return (
      <KeyMaps
        keyMap={pm.shortcuts.getShortcuts()}
        handlers={this.getKeyMapHandlers()}
      >
        <div
          style={{
            minWidth: isResponsivePage() ? 'unset' : `${AppSettingsDefaults.ui.REQUESTER_MIN_WIDTH}px`
          }}
          className={classnames({
            'app-requester': true,
            'requester-homepage-signed-out': isHomePageActive() && !isLoggedIn
          })}
        >
          <div id='dropdown-root' style={{ width: 0, height: 0 }} />
          <div id='auto-suggest-root' style={{ width: 0, height: 0 }} />
          <div id='right-overlay-root' />
          <div id='overlay-root' />
          {this.renderHeader()}
          {this.renderPage()}
          <NotificationSystem
            allowHTML
            ref='notificationSystem'
            style={AppNotificationStyles}
          />
        </div>
      </KeyMaps>
    );
  }
}

export default Platform;
