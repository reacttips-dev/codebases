import React from 'react';
import store from 'js/lib/coursera.store';
import { Tooltip } from 'react-bootstrap-33';
import classNames from 'classnames';
import { Button, SvgButton, Box, color } from '@coursera/coursera-ui';
import { SvgBulletList, SvgBulletListRtl } from '@coursera/coursera-ui/svg';
import withSingleTracked from 'bundles/common/components/withSingleTracked';
import { isUserRightToLeft } from 'js/lib/language';
import _t from 'i18n!nls/item';

import 'css!./__styles__/SecondaryNavTogglePanel';

type Props = {
  active: boolean;
  onToggleClick: () => void;
  toggleSvgElement?: JSX.Element;
};

type State = {
  hideTutorial: boolean;
};

const TrackedSvgButton = withSingleTracked({ type: 'BUTTON' })(SvgButton);
const TrackedButton = withSingleTracked({ type: 'BUTTON' })(Button);

const NAV_TUTORIAL_KEY = 'itemNavTutorialSeen';

class SecondaryNavTogglePanel extends React.Component<Props, State> {
  state = {
    hideTutorial: store.get(NAV_TUTORIAL_KEY),
  };

  // Run the passed click handler and close the tutorial.
  // The tutorial has served its purpose if the user uses the feature.
  handleToggleClick = () => {
    const { onToggleClick } = this.props;
    onToggleClick();
    this.hideTutorial();
  };

  hideTutorial = () => {
    this.setState(() => {
      store.set(NAV_TUTORIAL_KEY, true);
      return { hideTutorial: true };
    });
  };

  renderSvgBulletList = () => {
    const SvgBulletListComponent = isUserRightToLeft() ? SvgBulletListRtl : SvgBulletList;
    return <SvgBulletListComponent color={color.black} hoverColor={color.black} size={20} suppressTitle={true} />;
  };

  render() {
    const { active, toggleSvgElement } = this.props;
    const { hideTutorial } = this.state;

    return (
      <Box rootClassName="rc-SecondaryNavTogglePanel" justifyContent="start" alignItems="center" flexDirection="column">
        <TrackedSvgButton
          trackingName="toggle_secondary_nav"
          trackingData={{ currentlyActive: active }}
          rootClassName={classNames('nav-tool-button', { active })}
          onClick={this.handleToggleClick}
          htmlAttributes={{
            'aria-label': _t('Toggle Navigation Panel'),
            'aria-expanded': active,
            'aria-describedby': hideTutorial ? undefined : 'secondary-navTogglePanel-instructions',
          }}
          size="zero"
          type="icon"
          svgElement={toggleSvgElement || this.renderSvgBulletList()}
        />

        {!hideTutorial && (
          <Tooltip placement="right" className="sidebar-tutorial-tooltip">
            <Box className="tooltip-content" justifyContent="start" alignItems="stretch">
              <span id="secondary-navTogglePanel-instructions" className="tooltip-text">
                {_t('Click the sidebar icons to open lesson lists and notes.')}
              </span>
              <div className="tooltip-button-container">
                <TrackedButton
                  trackingName="close_tooltip_secondary_nav"
                  trackingData={{ currentlyActive: active }}
                  onClick={this.hideTutorial}
                  rootClassName="tooltip-button"
                  type="secondary"
                  size="sm"
                  style={{ textAlign: 'right' }}
                >
                  {_t('Okay, got it!')}
                </TrackedButton>
              </div>
            </Box>
          </Tooltip>
        )}
      </Box>
    );
  }
}

export default SecondaryNavTogglePanel;
