import { Button } from '@udacity/veritas-components';
import PropTypes from 'prop-types';
import withAnalytics from 'decorators/analytics';

export class TrackingButton extends React.Component {
  static displayName = 'common/tracking-button';

  static propTypes = {
    onClick: PropTypes.func,
    track: PropTypes.func.isRequired /* withAnalytics */,
    trackingEventName: PropTypes.string,
    trackingOptions: PropTypes.object,
  };

  static defaultProps = {
    trackingEventName: '',
    trackingOptions: {},
    onClick: _.noop,
  };

  handleTracking(pageLocation) {
    const { track, to, trackingEventName, trackingOptions, label } = this.props;
    const options = {
      destination_url: to,
      page_location: pageLocation,
      cta_type: 'button',
      message: label || '',
      ...trackingOptions,
    };

    if (trackingEventName) {
      track(trackingEventName, options);
    }
  }

  handleClick = (e) => {
    const { onClick } = this.props;

    if (onClick) {
      onClick();
    }

    if (e.defaultPrevented) {
      return;
    }

    this.handleTracking(`${e.nativeEvent.offsetX}, ${e.nativeEvent.offsetY}`);
  };

  render() {
    return (
      <Button
        {..._.omit(this.props, _.keys(TrackingButton.propTypes))}
        onClick={this.handleClick}
      />
    );
  }
}

export default withAnalytics(TrackingButton);
