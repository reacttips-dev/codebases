import { radioChoice, response } from './_prop-types';
import PropTypes from 'prop-types';
import { Radio } from '@udacity/veritas-components';
import TimestampInput from 'components/content-feedback/timestamp-input';
import styles from './radio-choices.scss';

@cssModule(styles)
export default class RadioChoices extends React.Component {
  static displayName = 'components/content-feedback/radio-choices';

  static propTypes = {
    response: response,
    choices: PropTypes.arrayOf(radioChoice),
    onSelect: PropTypes.func,
  };

  handleSelectAnswer = (idx, answer, question) => {
    const { onSelect, onQuestionAnswered } = this.props;
    onQuestionAnswered();
    onSelect(answer, question, idx);
  };

  render() {
    const { choices, title, response } = this.props;

    return (
      <ul styleName="radio-group-container">
        <h2>{title}</h2>
        {_.map(choices, (choice, idx) => {
          const isChecked = response.radioKey === idx;
          return (
            <li key={idx}>
              {choice.input ? (
                <div styleName="radio">
                  <Radio
                    id={'radio-' + idx}
                    label={choice.text}
                    name="radio-choices"
                    checked={isChecked}
                    onChange={() => this.handleSelectAnswer(idx, null)}
                  />
                  {isChecked && (
                    <div styleName="radio-text-input">
                      <TimestampInput
                        id={choice.input.prompt}
                        label={choice.input.prompt}
                        onChange={(value) =>
                          this.handleSelectAnswer(
                            idx,
                            value,
                            _.join([choice.question, choice.input.prompt])
                          )
                        }
                      />
                    </div>
                  )}
                </div>
              ) : (
                <Radio
                  id={'radio-' + idx}
                  name="radio-choices"
                  checked={isChecked}
                  label={choice.text}
                  onChange={() =>
                    this.handleSelectAnswer(idx, true, choice.text)
                  }
                />
              )}
            </li>
          );
        })}
      </ul>
    );
  }
}
