import AtomHelper from 'helpers/atom-helper';
import { Button } from '@udacity/veritas-components';
import ClassroomPropTypes from 'components/prop-types';
import EvaluationsService from 'services/evaluations-service';
import PropTypes from 'prop-types';
import ResultModal from 'components/atoms/common/result-modal';
import StaticContentPlaceholder from 'components/common/static-content-placeholder';
import { UreactRadioQuizAtom } from '@udacity/ureact-atoms';
import { __ } from 'services/localization-service';
import { actionsBinder } from 'helpers/action-helper';
import { connect } from 'react-redux';
import styles from './radio-quiz-atom.scss';

@cssModule(styles)
class RadioQuizAtom extends React.Component {
  static displayName = 'atoms/radio-quiz-atom';

  static propTypes = {
    nodeKey: PropTypes.string.isRequired,
    atom: ClassroomPropTypes.radioQuizAtom.isRequired,
    unstructuredData: PropTypes.object,
    onFinish: PropTypes.func,
  };

  static contextTypes = {
    root: PropTypes.object,
  };

  static defaultProps = {
    unstructuredData: null,
    onFinish: _.noop,
  };

  state = {
    selectedId: _.get(this.props.unstructuredData, 'selected_id'),
    isCorrect: _.get(this.props.unstructuredData, 'is_correct'),
    isResultModalOpen: false,
    feedback: null,
    video_feedback: null,
  };

  handleAnswerChange = ([selectedId]) => {
    this.setState({
      selectedId,
      isCorrect: null,
    });
  };

  handleSubmitClick = () => {
    const { root } = this.context;
    const { selectedId } = this.state;
    const { atom, nodeKey, updateUnstructuredUserStateData } = this.props;

    return EvaluationsService.gradeRadioQuizAtom({
      nodeKey,
      nodeId: atom.id,
      rootKey: root.key,
      rootId: root.id,
      selectedId,
    }).then(({ is_correct, feedback, video_feedback }) => {
      this.setState({
        isResultModalOpen: true,
        isCorrect: is_correct,
        feedback,
        video_feedback,
      });

      return updateUnstructuredUserStateData({
        rootKey: root.key,
        rootId: root.id,
        nodeKey,
        nodeId: atom.id,
        json: {
          selected_id: selectedId,
          is_correct: is_correct,
        },
      });
    });
  };

  render() {
    const { onFinish, atom, atoms, nodeKey } = this.props;
    const {
      selectedId,
      isCorrect,
      isResultModalOpen,
      feedback,
      video_feedback,
    } = this.state;
    const { index, count } = AtomHelper.getQuestionNumberAndCount(
      nodeKey,
      atoms
    );

    return (
      <StaticContentPlaceholder
        placeholder={
          <div className={styles['prevent-clicking']}>
            <UreactRadioQuizAtom
              atom={atom}
              selectedId={_.chain(atom.question.answers)
                .find('is_correct')
                .get('id')
                .value()}
              index={index}
              count={count}
              isCorrect={true}
            />
          </div>
        }
      >
        <div>
          <ResultModal
            isOpen={isResultModalOpen}
            onRequestClose={() => this.setState({ isResultModalOpen: false })}
            onContinueOnSuccessfulResult={onFinish}
            hasAnswer={true}
            feedback={feedback}
            video_feedback={video_feedback}
            passed={isCorrect}
          />

          <UreactRadioQuizAtom
            atom={atom}
            selectedId={selectedId}
            index={index}
            count={count}
            isCorrect={isCorrect}
            onAnswerChange={this.handleAnswerChange}
          />

          <div styleName="buttons">
            <Button
              variant="primary"
              disabled={_.isEmpty(selectedId)}
              onClick={this.handleSubmitClick}
              label={__('Submit')}
            />
          </div>
        </div>
      </StaticContentPlaceholder>
    );
  }
}

export default connect(
  null,
  actionsBinder('updateUnstructuredUserStateData')
)(RadioQuizAtom);
