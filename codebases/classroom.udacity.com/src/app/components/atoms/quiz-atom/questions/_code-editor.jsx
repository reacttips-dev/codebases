import CodeEditor from '@udacity/ureact-code-editor';
import PropTypes from 'prop-types';

export default class extends React.Component {
  static displayName = 'atoms/quiz-atom/questions/_code-editor';

  static propTypes = {
    files: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        name: PropTypes.name,
      })
    ),
    onChange: PropTypes.func,
  };

  static defaultProps = {
    files: [],
    onChange: _.noop,
  };

  render() {
    var { files, onChange } = this.props;

    return <CodeEditor files={files} onChange={onChange} />;
  }
}
