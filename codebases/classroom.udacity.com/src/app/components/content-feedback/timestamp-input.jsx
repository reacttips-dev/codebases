import {
  FormFieldset,
  FormValidation,
  TextInput,
} from '@udacity/veritas-components';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import styles from './timestamp-input.scss';

const MAX_TIME = 59;

@cssModule(styles)
export default class TimestampInput extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    label: PropTypes.string.isRequired,
  };

  state = {
    minutes: '',
    seconds: '',
    error: false,
  };

  getTimeStamp() {
    const { hours, minutes, seconds } = this.state;
    return `${hours || '00'}:${_.padStart(minutes, 2, '0') || '00'}:${
      _.padStart(seconds, 2, '0') || '00'
    }`;
  }

  handleChange = (evt, fieldName) => {
    const value = evt.target.value;
    if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= MAX_TIME)) {
      this.setState({ [fieldName]: value, error: false }, () =>
        this.props.onChange(this.getTimeStamp())
      );
    } else {
      this.setState({ error: true });
    }
  };

  render() {
    const { label } = this.props;
    const { minutes, seconds, error } = this.state;

    return (
      <div styleName="timestamp-input">
        <FormFieldset title={label}>
          <div styleName="inputs">
            <TextInput
              required
              type="number"
              value={minutes}
              placeholder={__('MM')}
              onChange={(evt) => this.handleChange(evt, 'minutes')}
            />
            <span>:</span>
            <TextInput
              required
              type="number"
              value={seconds}
              placeholder={__('SS')}
              onChange={(evt) => this.handleChange(evt, 'seconds')}
            />
          </div>
          {error && (
            <FormValidation
              message={__(
                `Please make sure your input is a number between 0 and ${MAX_TIME}.`
              )}
            />
          )}
        </FormFieldset>
      </div>
    );
  }
}
