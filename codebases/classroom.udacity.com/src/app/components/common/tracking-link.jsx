import { Link } from 'react-router';
import PropTypes from 'prop-types';
import withAnalytics from 'decorators/analytics';

// @withAnalytics added below
export class TrackingLink extends React.Component {
  static displayName = 'common/tracking-link';

  static propTypes = {
    ...Link.propTypes,
    onlyActiveOnIndex: PropTypes.bool,
    trackingOptions: PropTypes.object,
    trackingEventName: PropTypes.string.isRequired,

    /* withAnalytics */
    track: PropTypes.func.isRequired,
    getBaseInfo: PropTypes.func, // unused, but added to document the reason for its omission
  };

  static defaultProps = {
    trackingOptions: {},
  };

  handleTracking = (e) => {
    const {
      track,
      to,
      onClick,
      trackingEventName,
      trackingOptions,
    } = this.props;
    if (onClick) {
      onClick(e);
    }

    if (e.defaultPrevented) {
      return;
    }
    if (trackingEventName) {
      const options = {
        destination_url: to,
        page_location: `${e.nativeEvent.offsetX}, ${e.nativeEvent.offsetY}`,
        cta_type: 'text',
        ...trackingOptions,
      };

      track(trackingEventName, options);
    }
  };

  render() {
    return (
      <Link
        {..._.omit(this.props, [
          'getBaseInfo',
          'onClick',
          'track',
          'trackVideoSeen',
          'trackingEventName',
          'trackingOptions',
        ])}
        onClick={this.handleTracking}
      >
        {this.props.children}
      </Link>
    );
  }
}

export default withAnalytics(TrackingLink);
