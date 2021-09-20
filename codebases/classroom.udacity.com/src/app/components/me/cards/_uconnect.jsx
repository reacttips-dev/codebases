import { ConnectCard, Leaderboard } from '@udacity/ureact-connect';
import { __, i18n } from 'services/localization-service';

import { Heading } from '@udacity/veritas-components';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import styles from './_uconnect.scss';

const transitionNames = {
  appear: styles['connect-appear'],
  appearActive: styles['connect-appear-active'],
};

export function UconnectContainer({ session }) {
  return (
    <ReactCSSTransitionGroup
      component="section"
      transitionName={transitionNames}
      transitionLeaveTimeout={300}
      transitionEnterTimeout={300}
      transitionAppear={true}
      transitionAppearTimeout={1000}
    >
      <div styleName="uconnect-container">
        <Heading size="h5" as="h2">
          {__('Latest Activity')}
        </Heading>
        <ConnectCard
          env={ENV}
          locale={i18n.getLocale()}
          ndProgress={_.get(session, 'ndProgress', {})}
        />
        <div styleName="leaderboard-container">
          <Leaderboard env={ENV} session={session} />
        </div>
      </div>
    </ReactCSSTransitionGroup>
  );
}

UconnectContainer.displayName = 'uconnect-container';

UconnectContainer.propTypes = {
  session: PropTypes.object.isRequired,
};

export default cssModule(UconnectContainer, styles);
