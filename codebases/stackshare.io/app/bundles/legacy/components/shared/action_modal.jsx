import React, {Component} from 'react';
import {observer} from 'mobx-react';

export default
@observer
class ActionModal extends Component {
  constructor(props) {
    super(props);
    // Function to call on sucessful action (i.e. create / edit / delete)
    this.successFn = this.props.successFn;
    // Function to call when clicking the cancel button
    this.cancelFn = this.props.cancelFn;
    // Content to display in the modal body
    this.content = this.props.content;
  }

  render() {
    return (
      <div className="action_modal">
        <div onClick={this.cancelFn} className="action_modal__overlay" />
        <div className="action_modal__dialog_wrapper modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <a onClick={this.cancelFn} className="close">
                x
              </a>
            </div>
            <div className="modal-body">
              <p>{this.content}</p>
            </div>
            <div className="modal-footer">
              <a onClick={this.cancelFn} className="btn btn-ss-g">
                Cancel
              </a>
              <a onClick={this.successFn} className="btn btn-ss-r-alt confirm">
                Confirm
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
