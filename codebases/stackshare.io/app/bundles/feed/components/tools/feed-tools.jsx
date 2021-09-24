import React, {Component} from 'react';
import glamorous from 'glamorous';
import PropTypes from 'prop-types';
import TrendingTools from '../../components/sidebar/trending-tools.jsx';
import FollowedTools from '../../components/sidebar/followed-tools.jsx';
import {Tabs} from '../../../../shared/library/tabs';
import {ASH, GUNSMOKE, FOCUS_BLUE, WHITE, TARMAC} from '../../../../shared/style/colors';
import Heading from '../../components/heading/heading.jsx';
import {withLocalStorage} from '../../../../shared/enhancers/local-storage-enhancer.js';
import TrendingIcon from '../icons/trending-icon.svg';
import {BASE_TEXT} from '../../../../shared/style/typography.js';
import {withCurrentUser} from '../../../../shared/enhancers/current-user-enhancer.js';
import {compose} from 'react-apollo';
import {SIGN_IN_PATH} from '../../constants/utils';
import {NavigationContext} from '../../../../shared/enhancers/router-enhancer';
import {forceVisible} from 'react-lazyload';

export const FIRST_LOGIN = 'firstLogin';

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
    color: isOpen ? WHITE : TARMAC,
    '> svg > path': {
      fill: isOpen ? WHITE : GUNSMOKE
    }
  })
);

const StyledTrendingIcon = glamorous(TrendingIcon)({
  marginLeft: 7,
  marginRight: 7,
  width: 15
});

const Tools = glamorous.aside({
  height: 403
});

const Divider = glamorous.div({
  height: 2,
  borderBottom: `1px solid ${ASH}`,
  marginBottom: 23
});

const tabItems = [
  {title: 'Following', contents: <FollowedTools />},
  {
    title: (
      <React.Fragment>
        Trending <StyledTrendingIcon />
      </React.Fragment>
    ),
    contents: <TrendingTools />
  }
];

class FeedTools extends Component {
  static propTypes = {
    currentUser: PropTypes.object,
    storageProvider: PropTypes.object,
    openIndex: PropTypes.number
  };

  static defaultProps = {
    openIndex: 1
  };

  state = {
    openIndex: this.props.openIndex,
    changeTabsAllowed: true
  };

  stateReducer = (actualState, changesObject) => {
    if (!this.state.changeTabsAllowed) {
      return null;
    } else {
      return {openIndex: changesObject.openIndex};
    }
  };

  handleOnClick = navigate => {
    if (!this.props.currentUser && this.state.openIndex === 1) {
      this.setState({openIndex: 1, changeTabsAllowed: false});
      navigate(SIGN_IN_PATH);
    }
    forceVisible();
  };

  componentDidMount() {
    this.firstRun();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.openIndex !== this.props.openIndex) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({openIndex: this.props.openIndex});
    }
  }

  firstRun() {
    const {storageProvider, currentUser} = this.props;
    if (!storageProvider.getBoolean(FIRST_LOGIN) && currentUser) {
      this.setState({openIndex: 0});
    }
    storageProvider.setItem(FIRST_LOGIN, true);
  }

  render() {
    const tabs = tabItems.map(({title, contents}) => ({
      title: ({isOpen}) => (
        <NavigationContext.Consumer>
          {navigate => (
            <TabHeader onClick={() => this.handleOnClick(navigate)} isOpen={isOpen}>
              {title}
            </TabHeader>
          )}
        </NavigationContext.Consumer>
      ),
      contents
    }));

    return (
      <Tools>
        <Heading>Tools</Heading>
        <Divider />
        <Tabs items={tabs} openIndex={this.state.openIndex} stateReducer={this.stateReducer} />
      </Tools>
    );
  }
}

export default compose(
  withCurrentUser,
  withLocalStorage('Tools', '1')
)(FeedTools);
