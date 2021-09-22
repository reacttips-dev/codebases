import PropTypes from 'prop-types';
import React from 'react';
import _t from 'i18n!nls/discussions';

class ReplyFollow extends React.Component {
  static propTypes = {
    checked: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
  };

  render() {
    const { checked, onChange } = this.props;

    return (
      <div className="rc-ReplyFollow horizontal-box body-1-text">
        <label style={{ fontWeight: 'normal' }}>
          <input
            type="checkbox"
            checked={checked}
            style={{ marginRight: 10 }}
            onChange={(event) => onChange(event.target.checked)}
          />

          {_t('Follow this discussion to receive emails when others reply')}
        </label>
      </div>
    );
  }
}

export default ReplyFollow;
