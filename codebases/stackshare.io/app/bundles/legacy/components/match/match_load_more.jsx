import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {observer} from 'mobx-react';

export default
@observer
class MatchLoadMore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };

    this.searchDone = this.searchDone.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    $(document).on('match.search.done', this.searchDone);
  }
  componentWillUnmount() {
    $(document).off('match.search.done', this.searchDone);
  }
  searchDone() {
    this.setState({loading: false});
  }

  loadMore() {
    this.setState({loading: true});
    let indexName = this.context.globalStore.visibleIndex;
    this.context.globalStore.loadMore(indexName);
  }

  render() {
    let renderedItems = this.context.globalStore['matched' + this.context.globalStore.visibleIndex]
      .length;
    let totalItems = this.context.globalStore[
      'matchedTotal' + this.context.globalStore.visibleIndex
    ];
    if (totalItems > renderedItems) {
      if (this.state.loading)
        return <button className="button centered-and-alone disabled">Loading...</button>;
      else
        return (
          <button className="button centered-and-alone m150" onClick={this.loadMore}>
            Load More
          </button>
        );
    } else {
      return null;
    }
  }
}

MatchLoadMore.contextTypes = {
  globalStore: PropTypes.object
};
