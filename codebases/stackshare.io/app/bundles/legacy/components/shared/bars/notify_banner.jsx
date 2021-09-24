import React, {Component} from 'react';
import PropTypes from 'prop-types';

class NotifyBanner extends Component {
  static propTypes = {
    type: PropTypes.string,
    message: PropTypes.any,
    icon: PropTypes.string,
    dismiss: PropTypes.func
  };

  static defaultProps = {
    type: 'info'
  };

  // type options:
  // 'info', 'success', 'error', 'serverError'
  renderNotifications() {
    const {type, message, icon} = this.props;

    // Simple string notification:
    //   message: 'We detected tools',
    // Array notification:
    // Accomodates json errors from server
    //   message: { username: ['is taken', 'cannot contain spaces'] }

    if (!message) {
      this.handleDismiss();
    }

    // todo's for long onboarding flow:
    // handle styling of multiple errors (banner height, margins, etc)
    // (height will be tricky due to the fixed header/footer layout)
    if (type === 'serverError' && message instanceof Object) {
      const messageArray = this.extractMessages(message);
      return messageArray.map((messageText, i) => {
        return (
          <div key={i} className="message-wrap">
            {messageText}
          </div>
        );
      });
    } else if (icon) {
      return (
        <div className="message-wrap">
          <div className="message-with-icon">
            <i className={`message-icon fa ${icon}`} />
            <span>{message}</span>
          </div>
        </div>
      );
    } else {
      return <div className="message-wrap">{message}</div>;
    }
  }

  extractMessages(message) {
    const messageArray = [];
    const keys = Object.keys(message);
    keys.forEach(key => {
      let capitalizedKey = _.capitalize(key);
      message[key].map(messageString => {
        messageArray.push(`${capitalizedKey} ${messageString}`);
      });
    });
    return messageArray;
  }

  isError() {
    const {type} = this.props;
    return type === 'error' || type === 'serverError';
  }

  renderDismiss() {
    if (this.isError()) {
      return null;
    } else {
      return <i onClick={this.handleDismiss.bind(this)} className="close-banner fa fa-times" />;
    }
  }

  handleDismiss() {
    this.props.dismiss();
  }

  getClassName() {
    return this.isError() ? 'error' : this.props.type;
  }

  render() {
    return (
      <div className={`notify-banner notify-banner--type-${this.getClassName()}`}>
        {this.renderNotifications()}
        {this.renderDismiss()}
      </div>
    );
  }
}

export default NotifyBanner;
