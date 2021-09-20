import { Button } from '@udacity/veritas-components';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import styles from './_buttons.scss';

class Buttons extends React.Component {
  static displayName = 'atoms/quiz-atom/questions/_buttons';

  static propTypes = {
    onSubmit: PropTypes.func,
    onReset: PropTypes.func,
    onTest: PropTypes.func,
    onViewAnswer: PropTypes.func,
  };

  handleSubmit = () => {
    return Promise.resolve(this.props.onSubmit());
  };

  render() {
    const { onReset, onTest, onViewAnswer, onSubmit } = this.props;
    return (
      <ul styleName="buttons">
        {onReset && (
          <li>
            <Button
              variant="secondary"
              onClick={onReset}
              label={__('Reset Quiz')}
            />
          </li>
        )}

        {onTest && (
          <li>
            <Button
              variant="secondary"
              onClick={onTest}
              label={__('Test Run')}
            />
          </li>
        )}

        {onViewAnswer && (
          <li>
            <Button
              variant="secondary"
              onClick={onViewAnswer}
              label={__('View Answer')}
            />
          </li>
        )}

        {onSubmit && (
          <li>
            <Button
              variant="primary"
              onClick={this.handleSubmit}
              label={__('Submit Answer')}
            />
          </li>
        )}
      </ul>
    );
  }
}

export default cssModule(Buttons, styles);
