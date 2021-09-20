import AnalyticsService from 'services/analytics-service';
import { Link } from 'react-router';
import RouteMixin from 'mixins/route-mixin';
import { __ } from 'services/localization-service';
import createReactClass from 'create-react-class';
import styles from './connect.scss';

const ANALYTICS_VIEWED = 'Connect CTA Displayed';
const ANALYTICS_SIGN_UP = 'Connect CTA Sign Up Now Clicked';
const ANALYTICS_LEARN_MORE = 'Connect CTA Learn More Clicked';

export default cssModule(
  createReactClass({
    displayName: 'notifications/connect',

    mixins: [RouteMixin],

    componentDidMount() {
      AnalyticsService.track(ANALYTICS_VIEWED);
    },

    handleSignUpClick() {
      AnalyticsService.track(ANALYTICS_SIGN_UP);
    },

    handleLearnMoreClick() {
      AnalyticsService.track(ANALYTICS_LEARN_MORE);
    },

    render() {
      return (
        <div>
          <Link
            className={styles['link']}
            to={`${this.subscriptionsPath()}?modal=connect`}
            onClick={this.handleSignUpClick}
          >
            <span>
              <span className={styles['sign-up']}>{__('Sign Up Now')}</span>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <span className={styles['text']}>
                {__(
                  'Attend in-person learning sessions with Udacity Connect. Available now in San Francisco and LA.'
                )}
              </span>
            </span>
          </Link>{' '}
          <a
            href="//udacity.com/uconnect"
            target="_blank"
            onClick={this.handleLearnMoreClick}
          >
            {__('Learn More')}
          </a>
        </div>
      );
    },
  }),
  styles
);
