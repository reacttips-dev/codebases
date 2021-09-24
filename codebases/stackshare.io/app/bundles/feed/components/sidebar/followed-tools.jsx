import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import DebouncedInput from '../../../../shared/library/inputs/debounced/index.jsx';
import ScrollPanel from '../../../../shared/library/panels/scroll/index.jsx';
import ServiceList from './service-list.jsx';
import ProgressIndicator, {
  MEDIUM
} from '../../../../shared/library/indicators/indeterminate/circular';
import {withAnalyticsPayload} from '../../../../shared/enhancers/analytics-enhancer';
import {Query} from 'react-apollo';
import {tools} from '../../../../data/feed/queries';
import {flattenEdges} from '../../../../shared/utils/graphql';
import MagnifyingIcon from '../icons/magnifying.svg';

const Container = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  width: 300
});

export const Center = glamorous.div({
  width: '100%',
  display: 'flex',
  justifyContent: 'center'
});

const Search = glamorous.div({
  padding: '0 0 15px 0',
  position: 'relative',
  marginTop: 15,
  ' input': {
    padding: '0 15px 0 30px'
  }
});

const StyledMagnifyingIcon = glamorous(MagnifyingIcon)({
  width: 15,
  position: 'absolute',
  top: 16,
  left: 10
});

const HEIGHT = 218;

export class FollowedTools extends Component {
  static propTypes = {
    searchDelay: PropTypes.number
  };

  static defaultProps = {
    searchDelay: 1000
  };

  state = {
    keyword: ''
  };

  render() {
    const {searchDelay} = this.props;
    const {keyword} = this.state;

    return (
      <Query query={tools} variables={{keyword}} fetchPolicy="network-only">
        {({data, loading}) => (
          <Container>
            <Search>
              <DebouncedInput
                onChange={keyword => this.setState({keyword})}
                wait={searchDelay}
                placeholder="Search Tools to customize your feed"
              />
              <StyledMagnifyingIcon />
            </Search>
            {loading && (
              <Center>
                <ProgressIndicator size={MEDIUM} />
              </Center>
            )}
            {!loading && (
              <ScrollPanel height={HEIGHT}>
                <ServiceList
                  services={flattenEdges(data.tools, [])}
                  showEmptyMsg={!loading && keyword === ''}
                />
              </ScrollPanel>
            )}
          </Container>
        )}
      </Query>
    );
  }
}

export default withAnalyticsPayload({location: 'Follow Panel'})(FollowedTools);
