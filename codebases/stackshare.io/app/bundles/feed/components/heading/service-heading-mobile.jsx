import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import BaseHeading from './heading.jsx';
import {FOCUS_BLUE, TARMAC, ASH} from '../../../../shared/style/colors';
import {BASE_TEXT} from '../../../../shared/style/typography';
import FollowServiceButton from '../../../../shared/library/buttons/follow/follow-service-button';
import {withSendAnalyticsEvent} from '../../../../shared/enhancers/analytics-enhancer';
import {FEED_CLICK_TOOL_FOLLOW} from '../../constants/analytics';
import {TOOL} from '../../../../shared/constants/analytics';

export const Container = glamorous.header({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  paddingLeft: 18,
  paddingRight: 18,
  marginTop: 28,
  marginBottom: 14
});

export const Heading = glamorous(BaseHeading)({
  marginTop: 10,
  marginBottom: 0,
  marginRight: 0,
  fontSize: 24
});

export const Link = glamorous.a({
  ...BASE_TEXT,
  cursor: 'pointer',
  color: TARMAC,
  fontSize: 13,
  ':visited': {
    color: TARMAC
  },
  ':hover': {
    color: FOCUS_BLUE
  }
});

export const ServiceIcon = glamorous.img({
  width: 44,
  height: 44,
  border: `1px solid ${ASH}`
});

export const Classification = glamorous.div({
  ...BASE_TEXT,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: 8,
  color: TARMAC,
  fontSize: 12,
  textAlign: 'center'
});

const ButtonWrapper = glamorous.div({
  marginTop: 12,
  display: 'flex',
  justifyContent: 'center'
});

class MobileServiceHeading extends Component {
  static propTypes = {
    service: PropTypes.object,
    sendAnalyticsEvent: PropTypes.func.isRequired
  };

  render() {
    const {
      id,
      name,
      following,
      imageUrl,
      layer: {name: layerName},
      category: {name: categoryName},
      function: {name: functionName}
    } = this.props.service;
    return (
      <Container>
        <ServiceIcon src={imageUrl} alt={`Logo of ${name}`} />
        <Heading>{name}</Heading>
        <Classification>
          {layerName}
          &nbsp;&middot;&nbsp;
          {categoryName}
          &nbsp;&middot;&nbsp;
          {functionName}
        </Classification>
        <ButtonWrapper>
          <FollowServiceButton
            serviceId={id}
            onToggle={() => {
              this.props.sendAnalyticsEvent(FEED_CLICK_TOOL_FOLLOW, {
                state: !following ? 'follow' : 'unfollow',
                id,
                name,
                followType: TOOL
              });
            }}
            following={following}
          />
        </ButtonWrapper>
      </Container>
    );
  }
}

export default withSendAnalyticsEvent(MobileServiceHeading);
