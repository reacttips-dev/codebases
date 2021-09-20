import PropTypes from 'prop-types';
import { QUESTION_TYPES } from './feedback-prompts';
import RadioChoices from './radio-choices';
import { TextArea } from '@udacity/veritas-components';
import TimestampInput from './timestamp-input';
import { subPrompt } from './_prop-types';

export default class SubPrompt extends React.Component {
  static displayName = 'components/content-feedback/sub-prompt';

  static propTypes = {
    onChange: PropTypes.func,
    subPrompt: subPrompt,
  };

  handleChange = (answer, question, key) => {
    const { onChange } = this.props;
    return onChange(answer, question, key);
  };

  render() {
    const {
      subPrompt,
      subPromptResponse,
      onQuestionAnswered,
      isFocus,
    } = this.props;
    switch (subPrompt.type) {
      case QUESTION_TYPES.TEXT_INPUT:
        return (
          <li>
            <TextArea
              key={subPrompt.prompt}
              id={subPrompt.prompt}
              label={subPrompt.prompt}
              defaultValue={''}
              isFocus={isFocus}
              onChange={(evt) =>
                this.handleChange(evt.target.value, subPrompt.prompt)
              }
              required={subPrompt.required}
              onBlur={onQuestionAnswered}
            />
          </li>
        );
      case QUESTION_TYPES.TIME_INPUT:
        return (
          <li>
            <TimestampInput
              key={subPrompt.prompt}
              id={subPrompt.prompt}
              label={subPrompt.prompt}
              defaultValue={''}
              isFocus={isFocus}
              onChange={(value) => this.handleChange(value, subPrompt.prompt)}
              required={subPrompt.required}
              onBlur={onQuestionAnswered}
            />
          </li>
        );
      case QUESTION_TYPES.RADIO:
        return (
          <li>
            <RadioChoices
              title={subPrompt.prompt}
              required={subPrompt.required}
              response={subPromptResponse}
              choices={subPrompt.choices}
              onSelect={this.handleChange}
              onQuestionAnswered={onQuestionAnswered}
            />
          </li>
        );
    }
  }
}
