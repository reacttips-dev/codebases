import Buttons from './_buttons';
import CodeEditor from './_code-editor';
import PropTypes from 'prop-types';
import QuestionStaticPlaceholder from './question-static-placeholder';
import StaticContentPlaceholder from 'components/common/static-content-placeholder';
import { __ } from 'services/localization-service';

export default class extends React.Component {
  static displayName = 'atoms/quiz-atom/questions/_code-question';

  static propTypes = {
    files: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        name: PropTypes.name,
      })
    ),
    unstructuredData: PropTypes.object,
    onSubmit: PropTypes.func,
    onTest: PropTypes.func,
    onViewAnswer: PropTypes.func,
    title: PropTypes.string.isRequired,
  };

  static defaultProps = {
    unstructuredData: {},
    files: [],
    onSubmit: _.noop,
    onTest: null,
    onViewAnswer: null,
  };

  state = {
    formData: [],
  };

  componentWillMount() {
    this._updateFormData(this.props.files, this.props.unstructuredData);
  }

  handleCodeEditorChange = (data) => {
    this.setState({
      formData: data,
    });
  };

  handleReset = () => {
    this._updateFormData(this.props.files);
  };

  handleSubmit = () => {
    return this.props.onSubmit(
      this._convertToObjectFormat(this.state.formData)
    );
  };

  handleTest = () => {
    return this.props.onTest(this._convertToObjectFormat(this.state.formData));
  };

  _convertToObjectFormat = (arrayOfFiles) => {
    var output = {};

    _.each(arrayOfFiles, (fileObject) => {
      output[fileObject.name] = fileObject.text;
    });

    return output;
  };

  _updateFormData = (files, unstructuredData = null) => {
    var formData = _.cloneDeep(files);
    var cleanedUnstructuredData = [];

    if (unstructuredData) {
      _.each(unstructuredData, (file, idx) => {
        var value = { name: idx, text: file };

        if (value.name) {
          cleanedUnstructuredData.push(value);
        }
      });
    }

    if (cleanedUnstructuredData.length) {
      _.merge(formData, cleanedUnstructuredData);
    }

    this.setState({
      formData: formData,
    });
  };

  handleDownload = async () => {
    const { files, title } = this.props;
    const { zipAndDownloadFiles } = await import(
      'helpers/file-helper' /* webpackChunkName: "file-helper" */
    );
    zipAndDownloadFiles(files, title);
  };

  render() {
    var { formData } = this.state;
    var { onTest, children, onViewAnswer } = this.props;

    var handleTest = onTest ? this.handleTest : null;

    return (
      <StaticContentPlaceholder
        placeholder={
          <QuestionStaticPlaceholder
            atomName={__('programming quiz')}
            onDownload={this.handleDownload}
            onViewAnswer={onViewAnswer}
          />
        }
      >
        <div>
          <CodeEditor files={formData} onChange={this.handleCodeEditorChange} />

          {children}

          <Buttons
            onSubmit={this.handleSubmit}
            onReset={this.handleReset}
            onTest={handleTest}
            onViewAnswer={onViewAnswer}
          />
        </div>
      </StaticContentPlaceholder>
    );
  }
}
