import _t from 'i18n!nls/discussions';
import PropTypes from 'prop-types';
import React from 'react';
import 'css!./__styles__/NotifyOption';

class NotifyOption extends React.Component {
  static propTypes = {
    dontNotify: PropTypes.bool.isRequired,
    toggleNotify: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div className="rc-NotifyOption">
        <input id="notify" type="checkbox" checked={!this.props.dontNotify} onChange={this.props.toggleNotify} />
        <label htmlFor="notify" className="color-secondary-text">
          {_t('Notify Original Poster')}
        </label>
      </div>
    );
  }
}

export default NotifyOption;
