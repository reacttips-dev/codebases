import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {observer} from 'mobx-react';

export default
@observer
class MatchAndOrToggle extends Component {
  constructor(props) {
    super(props);
  }

  styles() {
    if (this.context.globalStore.searchOperator === 'AND') {
      return {color: '#0690fa'};
    } else {
      return {color: '#ccc'};
    }
  }

  toggleOperator = () => {
    if (this.context.globalStore.searching) {
      // console.log("We're leaving")
      return;
    }

    if (this.context.globalStore.searchOperator === 'AND') {
      this.context.globalStore.searchOperator = 'OR';
    } else {
      this.context.globalStore.searchOperator = 'AND';
    }
    $(document).trigger('builder.tool.operatorChanged');
    this.context.globalStore.serializeToUrl();
  };

  render() {
    return (
      <div className="match__and-or-toggle" onClick={this.toggleOperator}>
        <p>Exact Match</p>
        <div className="fa fa-check-square" style={this.styles()} />
      </div>
    );
  }
}

MatchAndOrToggle.contextTypes = {
  globalStore: PropTypes.object
};
