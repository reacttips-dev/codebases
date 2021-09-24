import React, {Component} from 'react';

export default class NotificationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationMsg: null
    };

    this.reportNotificationMsg = this.reportNotificationMsg.bind(this);
  }

  componentDidMount() {
    $(document).on('notification', this.reportNotificationMsg);
  }

  componentWillUnmount() {
    $(document).off('notification', this.reportNotificationMsg);
  }

  reportNotificationMsg(event, msg) {
    clearTimeout(this.notificationTimeout);
    this.setState({notificationMsg: msg});
    this.notificationTimeout = setTimeout(() => {
      this.setState({notificationMsg: null});
    }, 5000);
  }

  render() {
    return (
      <div
        className="notification-banner"
        style={{height: this.state.notificationMsg ? '50px' : 0}}
      >
        {this.state.notificationMsg}
      </div>
    );
  }
}
