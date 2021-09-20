import { Radio, Select, Text, TextArea } from '@udacity/veritas-components';

import PropTypes from 'prop-types';
import { TYPES } from 'constants/survey';
import { __ } from 'services/localization-service';
import styles from './_cancel-question.scss';

@cssModule(styles)
export default class CancelQuestion extends React.Component {
  static propTypes = {
    question: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
      .isRequired,
    reasons: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.object, PropTypes.string])
    ),
    type: PropTypes.string.isRequired,
    heading: PropTypes.element,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    hasOtherOption: PropTypes.bool,
    otherText: PropTypes.string,
    onOtherTextChange: PropTypes.func,
    onDropdownChange: PropTypes.func,
    onReasonChange: PropTypes.func,
    onTextChange: PropTypes.func,
  };

  renderInputs() {
    const { type } = this.props;
    switch (type) {
      case TYPES.DROPDOWN:
        return this.renderDropdown();
      case TYPES.RADIO:
        return this.renderRadioOptions();
      case TYPES.TEXT_AREA:
        return this.renderTextArea();
      default:
        return null;
    }
  }

  renderDropdown() {
    const { value, reasons, onDropdownChange, hiddenLabel } = this.props;
    return (
      <div styleName="dropdown">
        <Select
          id={'unpauseDate'}
          label={__('Unpause subscription date')}
          options={reasons}
          onChange={onDropdownChange}
          value={value}
          required
          hiddenLabel={hiddenLabel}
        />
      </div>
    );
  }

  renderTextArea() {
    const { value, onTextChange } = this.props;
    return (
      <div styleName="text-area">
        <TextArea
          rows={3}
          hiddenLabel
          label="response"
          id="response"
          onChange={(evt) => onTextChange(evt.target.value)}
          value={value}
        />
      </div>
    );
  }

  renderRadioOptions() {
    const {
      reasons,
      onOtherTextChange,
      onReasonChange,
      value,
      hasOtherOption,
      otherText,
    } = this.props;
    return (
      <ul styleName="responses-container">
        {_.map(reasons, (reason, idx) => {
          return (
            <li key={idx}>
              <Radio
                id={'response-' + idx}
                name="responses-group"
                label={reason.translated}
                checked={value === reason.raw}
                onChange={() => {
                  onReasonChange(reason);
                }}
              />
            </li>
          );
        })}
        {hasOtherOption && (
          <li styleName="other-reason">
            <Radio
              id="responses-other"
              name="responses-group"
              label={__('Other:')}
              checked={value === 'Other'}
              onChange={() => {
                onReasonChange({
                  key: 'Other',
                  raw: 'Other',
                  translated: __('Other'),
                });
              }}
            />
            <input
              styleName="other-reason-input"
              className="form-control"
              type="text"
              value={otherText}
              onChange={(evt) => onOtherTextChange(evt.target.value)}
              ref="otherReason"
            />
          </li>
        )}
      </ul>
    );
  }

  render() {
    const { heading, question } = this.props;

    return (
      <div>
        {heading}
        <Text spacing="1x">{question}</Text>
        {this.renderInputs()}
      </div>
    );
  }
}
