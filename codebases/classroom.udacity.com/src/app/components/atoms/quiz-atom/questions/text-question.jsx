import Markdown from '@udacity/ureact-markdown';
import PropTypes from 'prop-types';
import QuestionStaticPlaceholder from './question-static-placeholder';
import StaticContentPlaceholder from 'components/common/static-content-placeholder';
import { __ } from 'services/localization-service';

export default class extends React.Component {
  static displayName = 'atoms/quiz-atom/questions/text-question';

  static propTypes = {
    text: PropTypes.string.isRequired,
    onFormDataChange: PropTypes.func,
  };

  static defaultProps = {
    onFormDataChange: _.noop,
  };

  componentWillMount() {
    this.formData = {};
  }

  handleFormChange = (event) => {
    var { target } = event;

    this.formData['answer'] = target.value;

    this.props.onFormDataChange(this.formData);
  };

  render() {
    var { text } = this.props;

    return (
      <StaticContentPlaceholder
        placeholder={<QuestionStaticPlaceholder atomName={__('quiz')} />}
      >
        <form onChange={this.handleFormChange}>
          <Markdown text={text} />
          <br />
          <textarea name="answer" />
        </form>
      </StaticContentPlaceholder>
    );
  }
}
