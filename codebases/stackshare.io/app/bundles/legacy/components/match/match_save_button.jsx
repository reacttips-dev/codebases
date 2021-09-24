import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Savable, Saving, Saved} from './constants';

export default
@observer
class MatchSaveButton extends Component {
  constructor(props) {
    super(props);

    this.saveSelectedTools = this.saveSelectedTools.bind(this);
  }

  saveSelectedTools() {
    if (!this.context.routerProps.userId) {
      $(document).trigger('match.sign-in');
      return;
    }

    trackEvent('match.selectedTools.save', {
      toolCount: this.context.globalStore.selectedTools.length
    });
    this.context.globalStore.saveState = Saving;
    this.context.globalStore.saveSelectedTools();
  }

  render() {
    let saveButton;
    switch (this.context.globalStore.saveState) {
      case Savable:
        saveButton = (
          <button className="match__save-wrap__save" onClick={this.saveSelectedTools}>
            Save Search
          </button>
        );
        break;
      case Saving:
        saveButton = <button className="match__save-wrap__save disabled">Saving...</button>;
        break;
      case Saved:
        saveButton = <button className="match__save-wrap__save disabled">Saved</button>;
        break;
    }

    return <div className="match__save-wrap">{saveButton}</div>;
  }
}

MatchSaveButton.contextTypes = {
  globalStore: PropTypes.object,
  routerProps: PropTypes.object
};
