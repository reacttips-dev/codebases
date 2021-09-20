import { Button } from '@udacity/veritas-components';
import PropTypes from 'prop-types';
import TrackingButton from 'components/common/tracking-button';
import invariant from 'invariant';
import { routerShape } from 'react-router/lib/PropTypes';
import withAnalytics from 'decorators/analytics';

// Functionality can be further expanded by fully copying <Link> from react-router
// @withAnalytics added below
export class ButtonLink extends React.Component {
  static displayName = 'common/button-link';
  static propTypes = {
    ..._.omit(Button.propTypes, 'onClick'),
    target: PropTypes.string,
    to: PropTypes.string.isRequired,
    trackingEventName: PropTypes.string,
    trackingOptions: PropTypes.object,
    track: PropTypes.func.isRequired /* withAnalytics */,
  };

  static defaultProps = {
    trackingEventName: '',
    trackingOptions: {},
  };

  static contextTypes = {
    router: routerShape,
  };

  handleClick = () => {
    const { router } = this.context;
    const { target, to } = this.props;

    invariant(
      router,
      '<ButtonLink>s rendered outside of a router context cannot navigate.'
    );

    invariant(
      to,
      'A destination must be provided as a value on the `to` prop.'
    );
    const servicesTarget =
      target === 'hub' || target === 'knowledge' || target === 'portal';
    if (target) {
      servicesTarget ? window.open(to, '_self') : window.open(to, '_blank');
    } else {
      router.push(to);
    }
  };

  render() {
    return (
      <TrackingButton
        {..._.omit(this.props, 'onClick')}
        onClick={this.handleClick}
      />
    );
  }
}

export default withAnalytics(ButtonLink);
