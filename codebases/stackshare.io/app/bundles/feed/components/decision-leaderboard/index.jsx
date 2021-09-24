import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import Heading from '../heading/heading.jsx';
import ProgressIndicator, {
  MEDIUM
} from '../../../../shared/library/indicators/indeterminate/circular';
import {Center} from '../sidebar/followed-tools';
import {Leaderboard} from './leaderboard';
import {Container, Divider} from '../sidebar/trending-tools';
import {Tabs} from '../../../../shared/library/tabs';
import {FOCUS_BLUE, WHITE, TARMAC} from '../../../../shared/style/colors';
import {BASE_TEXT} from '../../../../shared/style/typography';
import {withQuery} from '../../../../shared/enhancers/graphql-enhancer';
import {leaderboards} from '../../../../data/feed/queries';

export const TYPE_USER = 'user';
export const TYPE_COMPANY = 'company';
export const TYPE_SERVICE = 'service';

const LeaderboardContainer = glamorous(Container)({
  marginBottom: 56
}).withComponent('aside');

const TabHeader = glamorous.div(
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...BASE_TEXT,
    cursor: 'pointer',
    height: 32,
    borderRadius: 2
  },
  ({isOpen}) => ({
    backgroundColor: isOpen ? FOCUS_BLUE : '#f0f0f0',
    color: isOpen ? WHITE : TARMAC
  })
);

export class DecisionLeaderboard extends Component {
  static propTypes = {
    leaderboards: PropTypes.array,
    loading: PropTypes.bool
  };

  mapNameToTitle = name => {
    switch (name) {
      case TYPE_USER:
        return 'Developers';
      case TYPE_COMPANY:
        return 'Companies';
      case TYPE_SERVICE:
        return 'Tools';
    }
  };

  render() {
    const {leaderboards, loading} = this.props;
    let items;
    if (!loading) {
      items = [
        leaderboards.find(b => b.name === TYPE_SERVICE),
        leaderboards.find(b => b.name === TYPE_USER),
        leaderboards.find(b => b.name === TYPE_COMPANY)
      ].map(({name, items}) => ({
        title: ({isOpen}) => <TabHeader isOpen={isOpen}>{this.mapNameToTitle(name)}</TabHeader>,
        contents: <Leaderboard items={items} type={name} />
      }));
    }
    return (
      <LeaderboardContainer>
        <Heading>Top Contributions</Heading>
        <Divider />
        {loading && (
          <Center>
            <ProgressIndicator size={MEDIUM} />
          </Center>
        )}
        {!loading && <Tabs items={items} />}
      </LeaderboardContainer>
    );
  }
}

export default withQuery(leaderboards, data => ({
  leaderboards: data.leaderboards,
  loading: data.loading
}))(DecisionLeaderboard);
