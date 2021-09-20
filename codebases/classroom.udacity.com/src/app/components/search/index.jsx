import Actions from 'actions';
import ClassroomPropTypes from 'components/prop-types';
import IndexedSearch from './_search';
import Overlay from 'components/common/overlay';
import PropTypes from 'prop-types';
import SettingsHelper from 'helpers/settings-helper';
import UiHelper from 'helpers/ui-helper';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import styles from './index.scss';
import withAnalytics from 'decorators/analytics';

@cssModule(styles)
export class SearchModal extends React.Component {
  static displayName = 'search/modal';
  static propTypes = {
    onHideSearch: PropTypes.func.isRequired,
    root: ClassroomPropTypes.node.isRequired,
    trackSearchFlow: PropTypes.func.isRequired,
  };

  state = {
    hasSearched: false,
  };

  componentDidMount() {
    this.props.trackSearchFlow('Search Opened');
  }

  handleSearch = () => {
    this.setState({
      hasSearched: true,
    });
  };

  handleHideSearch = () => {
    this.props.onHideSearch();
  };

  render() {
    const { root, trackSearchFlow } = this.props;

    return (
      <Overlay
        onHide={this.handleHideSearch}
        lightBackground={true}
        fullScreen={true}
      >
        <IndexedSearch
          root={root}
          onSearch={this.handleSearch}
          onNavigate={this.handleHideSearch}
          trackSearchFlow={trackSearchFlow}
        />
      </Overlay>
    );
  }
}

export class Search extends React.Component {
  static displayName = `search`;
  static propTypes = {
    params: PropTypes.shape({
      conceptKey: PropTypes.string,
    }),
    root: ClassroomPropTypes.node,

    // withAnalytics
    track: PropTypes.func.isRequired,
    getBaseInfo: PropTypes.func.isRequired,

    // Redux
    isSearchVisible: PropTypes.bool,
    onHideSearch: PropTypes.func.isRequired,
    onToggleSearch: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
  };

  trackSearchFlow = (eventName, options = {}) => {
    const {
      params: { conceptKey },
      track,
    } = this.props;
    track(eventName, {
      ...options,
      search_entry_point: conceptKey ? 'concept' : 'syllabus',
    });
  };

  render() {
    const { root, onHideSearch, isSearchVisible } = this.props;

    return isSearchVisible ? (
      <SearchModal
        root={root}
        onHideSearch={onHideSearch}
        trackSearchFlow={this.trackSearchFlow}
      />
    ) : null;
  }
}

const mapStateToProps = (state) => ({
  isSearchVisible: UiHelper.State.isSearchVisible(state),
  user: SettingsHelper.State.getUser(state),
});

export default compose(
  withAnalytics,
  connect(mapStateToProps, {
    onHideSearch: Actions.hideSearch,
    onToggleSearch: Actions.toggleSearch,
  })
)(Search);
