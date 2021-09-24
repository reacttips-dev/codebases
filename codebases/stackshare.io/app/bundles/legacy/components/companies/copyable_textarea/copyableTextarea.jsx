import React, {Component} from 'react';

export default class CopyableTextarea extends Component {
  constructor() {
    super();
    this.state = {
      copyValue: ''
    };
    this._copyButton = null;
  }

  handleChange = event => {
    this.setState({copyValue: event.target.value});
  };

  componentDidMount() {
    if (this._copyButton) {
      new Clipboard(this._copyButton);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.copyValue !== this.props.copyValue) {
      this.setState({copyValue: nextProps.copyValue});
    }
  }

  confirmButton() {
    return (
      <button
        className="btn btn-ss"
        onClick={this.props.onConfirmClick}
        style={{marginBottom: 10 + 'px', marginLeft: 10 + 'px'}}
      >
        Done
      </button>
    );
  }

  render() {
    return (
      <div style={{overflow: 'hidden'}}>
        <textarea
          value={this.state.copyValue}
          onChange={this.handleChange}
          style={{width: 100 + '% !important'}}
          id="copy-textarea"
          className="form-control"
          rows="5"
        />
        <button
          style={{marginBottom: 10 + 'px', marginTop: 10 + 'px'}}
          type="button"
          ref={el => (this._copyButton = el)}
          className="btn clipboard-btn btn-ss-alt"
          data-clipboard-target="#copy-textarea"
        >
          <span style={{paddingRight: 5 + 'px'}}>Click to copy</span>
          <span className="octicon octicon-clippy" />
        </button>
        {this.props.confirmButton && this.confirmButton()}
      </div>
    );
  }
}
