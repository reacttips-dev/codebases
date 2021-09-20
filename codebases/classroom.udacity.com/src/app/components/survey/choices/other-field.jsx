import { Checkbox, Radio } from '@udacity/veritas-components';

import PropTypes from 'prop-types';
import { SURVEY_TEXTS } from 'constants/survey';
import { TextInput } from '@udacity/veritas-components';

function createOtherInput(Component) {
  class OtherInput extends React.Component {
    static propTypes = {
      label: PropTypes.string,
      id: PropTypes.string,
      defaultValue: PropTypes.string,
      onTextChange: PropTypes.func,
      onInputChange: PropTypes.func,
    };

    state = {
      value: '',
    };

    handleInputChange = (evt) => {
      const { checked } = evt.target;
      const { onInputChange } = this.props;

      if (checked) {
        onInputChange(this.state.value);
      } else {
        onInputChange(null);
      }
    };

    handleTextChange = (evt) => {
      const { value } = evt.target;
      const { onTextChange } = this.props;

      onTextChange(value);
      this.setState({ value });
    };

    render() {
      const { defaultValue, label, id } = this.props;
      const { value } = this.state;
      const displayValue = value || defaultValue;

      return (
        <Component
          id={id}
          checked={!_.isNil(defaultValue)}
          onChange={this.handleInputChange}
          label={
            <div styleName="other-field">
              <TextInput
                id={_.snakeCase(label)}
                label={label}
                hiddenLabel={true}
                placeholder={SURVEY_TEXTS.OTHER_TEXT_INPUT}
                value={displayValue}
                onChange={this.handleTextChange}
              />
            </div>
          }
        />
      );
    }
  }
  return OtherInput;
}

export const OtherCheckbox = createOtherInput(Checkbox);
OtherCheckbox.displayName = 'survey/choices/other-checkbox';

export const OtherRadio = createOtherInput(Radio);
OtherRadio.displayName = 'survey/choices/other-radio';
