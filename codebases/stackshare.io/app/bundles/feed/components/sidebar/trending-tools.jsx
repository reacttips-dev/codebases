import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import ScrollPanel from '../../../../shared/library/panels/scroll/index.jsx';
import ServiceList from './service-list.jsx';
import {withAnalyticsPayload} from '../../../../shared/enhancers/analytics-enhancer';
import {compose} from 'react-apollo';
import {withQuery} from '../../../../shared/enhancers/graphql-enhancer';
import {trendingTools} from '../../../../data/feed/queries';
import {flattenEdges} from '../../../../shared/utils/graphql';
import {ASH} from '../../../../shared/style/colors.js';
import {withCurrentUser} from '../../../../shared/enhancers/current-user-enhancer.js';

const SCROLL_HEIGHT = 263;
const SCROLL_HEIGHT_LOGGEDOUT = 220;
const WIDTH = 300;

export const Container = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  padding: '15px 0',
  width: WIDTH
});

export const Divider = glamorous.div({
  height: 2,
  width: WIDTH,
  borderBottom: `1px solid ${ASH}`,
  marginBottom: 23
});

export class TrendingTools extends Component {
  static propTypes = {
    services: PropTypes.array.isRequired,
    currentUser: PropTypes.object
  };

  render() {
    const {services, currentUser} = this.props;
    return (
      <Container>
        {/* Added the scroll height loggedout because we only show the trending tools to loggedout users
         and the followed tools has a bit more space, so we wanted to reduce that padding*/}
        <ScrollPanel height={currentUser ? SCROLL_HEIGHT : SCROLL_HEIGHT_LOGGEDOUT}>
          <ServiceList trending={true} services={services} />
        </ScrollPanel>
      </Container>
    );
  }
}

export default compose(
  withQuery(trendingTools, data => ({
    services: flattenEdges(data.trendingTools, [])
  })),
  withAnalyticsPayload({location: 'Trending'}),
  withCurrentUser
)(TrendingTools);
