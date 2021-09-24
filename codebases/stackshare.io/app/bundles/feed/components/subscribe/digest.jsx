import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {ASH, WHITE} from '../../../../shared/style/colors';
import EnvelopeIcon from './envelope.svg';
import Heading from '../heading/heading.jsx';
import DecorativeButton from '../../../../shared/library/buttons/base/decorative';
import Checkbox from '../../../../shared/library/inputs/checkbox';
import {withSendAnalyticsEvent} from '../../../../shared/enhancers/analytics-enhancer';
import {FEED_CLICK_SUBSCRIBE} from '../../constants/analytics';
import Circular, {BUTTON} from '../../../../shared/library/indicators/indeterminate/circular';
import {withMutation} from '../../../../shared/enhancers/graphql-enhancer';
import {subscribeDigest} from '../../../../data/feed/mutations';
import {compose} from 'react-apollo';
import {NavigationContext} from '../../../../shared/enhancers/router-enhancer';
import {withCurrentUser} from '../../../../shared/enhancers/current-user-enhancer';
import {SIGN_IN_PATH} from '../../constants/utils';

export {DecorativeButton as SubscribeButton};

const Container = glamorous.aside({
  display: 'flex',
  flexDirection: 'column',
  padding: 32,
  border: `1px solid ${ASH}`,
  width: 256,
  backgroundColor: WHITE,
  borderRadius: 2,
  '>:first-child': {
    marginBottom: 16
  }
});

const Options = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  '>:first-child': {
    marginRight: 20
  },
  marginBottom: 24
});

const Label = Heading.withComponent('div');

export class DigestSubscribe extends Component {
  static propTypes = {
    weekly: PropTypes.bool,
    daily: PropTypes.bool,
    onSubscribe: PropTypes.func,
    sendAnalyticsEvent: PropTypes.func,
    currentUser: PropTypes.object
  };

  static defaultProps = {
    weekly: false,
    daily: false,
    sendAnalyticsEvent: () => null
  };

  constructor(props) {
    super(props);
    this.state = {
      weekly: props.weekly,
      daily: props.daily,
      updating: false,
      disabled: false
    };
  }

  handleSubscribe = navigate => {
    if (!this.props.currentUser) {
      navigate(SIGN_IN_PATH);
      return;
    }

    const {weekly, daily, disabled} = this.state;
    if (!disabled) {
      if (weekly !== this.props.weekly || daily !== this.props.daily) {
        this.props.sendAnalyticsEvent(FEED_CLICK_SUBSCRIBE, {weekly, daily});
        this.setState({updating: true, disabled: true}, () =>
          this.props.onSubscribe({weekly, daily}).then(() => this.setState({updating: false}))
        );
      }
    }
  };

  render() {
    let label = 'subscribe';

    const {weekly, daily, updating, disabled} = this.state;

    if (updating) {
      label = <Circular size={BUTTON} />;
    } else if (!updating && disabled) {
      label = 'subscribed';
    }

    return (
      <Container>
        <EnvelopeIcon />
        <Label>Get trending news delivered to your inbox</Label>
        <Options>
          <Checkbox
            disabled={disabled}
            checked={weekly}
            onToggle={() => this.setState({weekly: !weekly})}
          >
            weekly
          </Checkbox>
          <Checkbox
            disabled={disabled}
            checked={daily}
            onToggle={() => this.setState({daily: !daily})}
          >
            daily
          </Checkbox>
        </Options>
        <NavigationContext.Consumer>
          {navigate => (
            <DecorativeButton
              data-testid="subscribe"
              disabled={disabled}
              active={label === 'subscribed' || updating}
              onClick={() => this.handleSubscribe(navigate)}
            >
              {label}
            </DecorativeButton>
          )}
        </NavigationContext.Consumer>
      </Container>
    );
  }
}

export default compose(
  withCurrentUser,
  withSendAnalyticsEvent,
  withMutation(subscribeDigest, mutate => ({
    onSubscribe: ({weekly, daily}) =>
      mutate({
        variables: {settings: {emailFeedWeekly: weekly, emailFeedDaily: daily}}
      })
  }))
)(DigestSubscribe);
