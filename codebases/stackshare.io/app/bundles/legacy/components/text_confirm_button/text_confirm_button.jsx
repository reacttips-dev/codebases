import React, {Component} from 'react';

export default class TextConfirmButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
      confirmText: props.confirmText,
      buttonEnabled: false,
      inputEnabled: true
    };
  }

  handleChange = event => {
    if (event.target.value === this.state.confirmText) {
      this.setState({buttonEnabled: true, inputText: event.target.value});
    } else {
      this.setState({buttonEnabled: false, inputText: event.target.value});
    }
  };

  handleConfirm = () => {
    this.props.onConfirmClick();
    // When user clicks the confirm button, disable both the input and button.
    this.setState({buttonEnabled: false, inputEnabled: false});
  };

  render() {
    return (
      <div>
        <div>{this.props.warning}</div>
        <br />
        <input
          onChange={this.handleChange}
          disabled={!this.state.inputEnabled}
          type="text"
          ref="text"
          placeholder={this.state.confirmText}
          className="form-control delete-modal-in"
        />
        <button
          onClick={this.handleConfirm}
          disabled={!this.state.buttonEnabled}
          className="btn btn-danger btn-block"
        >
          {this.props.buttonText}
        </button>
      </div>
    );
  }
}
