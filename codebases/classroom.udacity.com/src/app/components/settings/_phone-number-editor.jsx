import 'react-phone-number-input/style.css';

import Flags from 'country-flag-icons/react/3x2';
import PhoneInput from 'react-phone-number-input/min';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import { i18n } from 'services/localization-service';
import styles from './_phone-number-editor.scss';

@cssModule(styles)
export default class PhoneNumberEditor extends React.Component {
  static displayName = 'settings/setting-personal-info/_phone-number-editor';

  static propTypes = {
    className: PropTypes.string,
    inputClassName: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  };

  render() {
    const { className, inputClassName, onChange, value } = this.props;

    return (
      <div styleName="phone-number-editor" className={className}>
        <PhoneInput
          flags={Flags}
          aria-label="Phone Number"
          placeholder={__('Phone Number')}
          numberInputProps={{ className: inputClassName }}
          country={i18n.getCountryCode()}
          value={value}
          onChange={onChange}
        />
      </div>
    );
  }
}
