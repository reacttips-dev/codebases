import React, {Component} from 'react';
import glamorous from 'glamorous';
import PropTypes from 'prop-types';
import ServiceTile, {SMALL} from '../../../../shared/library/tiles/service';
import {Container, Heading, Col, Tag} from './shared';
import FollowServiceButton from '../../../../shared/library/buttons/follow/follow-service-button';
import {withSendAnalyticsEvent} from '../../../../shared/enhancers/analytics-enhancer';
import {FEED_CLICK_TOOL_FOLLOW} from '../../constants/analytics';
import {TOOL} from '../../../../shared/constants/analytics';

const ButtonWrapper = glamorous.div({
  marginLeft: 'auto',
  display: 'flex',
  alignItems: 'center'
});

class ServiceHeading extends Component {
  static propTypes = {
    service: PropTypes.object,
    overlay: PropTypes.bool,
    sendAnalyticsEvent: PropTypes.func.isRequired
  };

  static defaultProps = {
    overlay: false
  };

  render() {
    const {service, overlay} = this.props;
    const {
      id,
      name,
      following,
      canonicalUrl,
      imageUrl,
      layer: {name: layerName},
      category: {name: categoryName},
      function: {name: functionName}
    } = service;
    return (
      <Container overlay={overlay}>
        <ServiceTile key={name} size={SMALL} name={name} href={canonicalUrl} imageUrl={imageUrl} />
        <Col>
          <Heading>
            <a href={canonicalUrl}>{name}</a>
          </Heading>
          <div>
            <Tag>{layerName}</Tag>
            {' / '}
            <Tag>{categoryName}</Tag>
            {' / '}
            <Tag>{functionName}</Tag>
          </div>
        </Col>
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

export default withSendAnalyticsEvent(ServiceHeading);
