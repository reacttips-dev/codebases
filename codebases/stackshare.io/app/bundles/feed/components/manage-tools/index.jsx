import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MobilePortal from '../../../../shared/library/modals/base/portal-mobile';
import MobileModal from '../../../../shared/library/modals/base/modal-mobile';
import {tools} from '../../../../data/feed/queries';
import glamorous from 'glamorous';
import {BASE_TEXT} from '../../../../shared/style/typography';
import {ALABASTER, ASH, CATHEDRAL} from '../../../../shared/style/colors';
import {debounce} from '../../../../shared/utils/debounce';
import {flattenEdges} from '../../../../shared/utils/graphql';
import ToolsList from './tools-list';
import ProgressIndicator, {
  MEDIUM
} from '../../../../shared/library/indicators/indeterminate/circular';
import {Query, withApollo} from 'react-apollo';

const SearchBar = glamorous.div({
  display: 'flex',
  paddingTop: 13,
  paddingBottom: 10,
  paddingLeft: 16,
  paddingRight: 16,
  background: ALABASTER
});

const SearchInput = glamorous.input({
  ...BASE_TEXT,
  height: 43,
  paddingLeft: 10,
  width: '100%',
  fontSize: 15,
  lineHeight: 1.47,
  color: CATHEDRAL,
  border: `1px solid ${ASH}`,
  outline: 'none',
  WebkitAppearance: 'none',
  borderRadius: 0
});

const Center = glamorous.div({
  display: 'flex',
  justifyContent: 'center',
  marginTop: 16
});

class ManageToolsModal extends Component {
  static propTypes = {
    onDismiss: PropTypes.func,
    client: PropTypes.object.isRequired
  };

  doChange = debounce(keyword => this.setState({keyword}), 1000);

  handleChange = event => this.doChange(event.target.value);

  state = {
    keyword: ''
  };
  tools = null;

  getCurrentTools() {
    const cache = this.props.client.cache.data.data;
    const tools = Object.keys(cache)
      .filter(k => k.startsWith('Service:'))
      .map(k => ({id: cache[k].id, following: cache[k].following}))
      .filter(t => t.following)
      .map(({id}) => ({id}));
    return JSON.stringify(tools);
  }

  componentDidMount() {
    this.tools = this.getCurrentTools();
  }

  handleDismiss = () => {
    const dirty = this.tools !== this.getCurrentTools();
    this.props.onDismiss(dirty);
  };

  render() {
    return (
      <Query query={tools} variables={{keyword: this.state.keyword}} fetchPolicy="network-only">
        {({data, loading}) => (
          <MobilePortal>
            <MobileModal title="Manage Tools" onDismiss={this.handleDismiss}>
              <SearchBar>
                <SearchInput placeholder="Search and follow tools" onChange={this.handleChange} />
              </SearchBar>
              {loading && (
                <Center>
                  <ProgressIndicator size={MEDIUM} />
                </Center>
              )}
              {!loading && <ToolsList tools={flattenEdges(data.tools, [])} />}
            </MobileModal>
          </MobilePortal>
        )}
      </Query>
    );
  }
}

export default withApollo(ManageToolsModal);
