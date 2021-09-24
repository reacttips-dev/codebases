import React, {Component} from 'react';

export default class ErrorBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMsg: null
    };

    this.reportErrorMsg = this.reportErrorMsg.bind(this);
  }

  componentDidMount() {
    $(document).on('errorMsg', this.reportErrorMsg);
  }

  componentWillUnmount() {
    $(document).off('errorMsg', this.reportErrorMsg);
  }

  reportErrorMsg(event, msg) {
    clearTimeout(this.errorTimeout);
    this.setState({errorMsg: msg});
    this.errorTimeout = setTimeout(() => {
      this.setState({errorMsg: null});
    }, 5000);
  }

  render() {
    return (
      <div className="error-banner" style={{height: this.state.errorMsg ? '50px' : 0}}>
        {this.state.errorMsg}
      </div>
    );
  }
}
