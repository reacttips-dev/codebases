import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import ServiceTile, {SMALL} from '../../../../shared/library/tiles/service.jsx';
import FollowServiceButton from '../../../../shared/library/buttons/follow/follow-service-button';
import {BASE_TEXT} from '../../../../shared/style/typography';
import {withSendAnalyticsEvent} from '../../../../shared/enhancers/analytics-enhancer';
import {FEED_CLICK_TOOL_FOLLOW} from '../../constants/analytics';
import {GUNSMOKE} from '../../../../shared/style/colors';
import {TOOL} from '../../../../shared/constants/analytics';
import {forceVisible} from 'react-lazyload';

const Layout = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  '>:last-child': {
    marginBottom: 0
  }
});

const Item = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  flexShrink: 0,
  marginBottom: 14,
  paddingRight: 10,
  '>:last-child': {
    marginLeft: 'auto'
  }
});

const Label = glamorous.div({
  ...BASE_TEXT,
  fontSize: 14,
  lineHeight: 1.4,
  marginLeft: 10,
  marginRight: 10,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
});

const EmptyMsg = glamorous.div({
  ...BASE_TEXT,
  fontSize: 14,
  color: GUNSMOKE,
  textAlign: 'center',
  lineHeight: 1.7,
  margin: '20px 15px'
});

export class ServiceList extends Component {
  static propTypes = {
    services: PropTypes.array.isRequired,
    trending: PropTypes.bool,
    sendAnalyticsEvent: PropTypes.func.isRequired,
    showEmptyMsg: PropTypes.bool
  };

  static defaultProps = {
    showEmptyMsg: false
  };

  render() {
    const {services, trending, showEmptyMsg} = this.props;
    return (
      <Layout>
        {services.map(({name, imageUrl, canonicalUrl, following, id}) => (
          <Item key={name}>
            {forceVisible()}
            <ServiceTile size={SMALL} name={name} href={canonicalUrl} imageUrl={imageUrl} />
            <Label trending={trending}>{name}</Label>
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
          </Item>
        ))}
        {showEmptyMsg && services.length === 0 && (
          <EmptyMsg>
            You aren&apos;t following any tools.
            <br />
            Use the search bar above to find and follow tools to personalize your feed experience.
          </EmptyMsg>
        )}
      </Layout>
    );
  }
}

export default withSendAnalyticsEvent(ServiceList);
