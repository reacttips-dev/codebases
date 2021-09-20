import AtomHelper from 'helpers/atom-helper';
import { Button } from '@udacity/veritas-components';
import ClassroomPropTypes from 'components/prop-types';
import EvaluationsService from 'services/evaluations-service';
import PropTypes from 'prop-types';
import ResultModal from 'components/atoms/common/result-modal';
import StaticContentPlaceholder from 'components/common/static-content-placeholder';
import { UreactCheckboxQuizAtom } from '@udacity/ureact-atoms';
import { __ } from 'services/localization-service';
import { actionsBinder } from 'helpers/action-helper';
import { connect } from 'react-redux';
import styles from './checkbox-quiz-atom.scss';

export default connect(
  null,
  actionsBinder('updateUnstructuredUserStateData')
)(
  cssModule(
    class extends React.Component {
      static displayName = 'atoms/checkbox-quiz-atom';

      static propTypes = {
        nodeKey: PropTypes.string.isRequired,
        atom: ClassroomPropTypes.checkboxQuizAtom.isRequired,
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

      constructor(props) {
        super(props);
        var unstructuredData = props.unstructuredData || {};

        this.state = {
          selectedIds: unstructuredData.selected_ids,
          isCorrect: unstructuredData.is_correct,
          isResultModalOpen: false,
          feedbacks: [],
          video_feedback: null,
        };
      }

      handleAnswerChange = (selectedIds) => {
        this.setState({
          selectedIds,
          isCorrect: null,
        });
      };

      handleSubmitClick = () => {
        var { root } = this.context;
        var { selectedIds } = this.state;
        var { atom, nodeKey } = this.props;

        return EvaluationsService.gradeCheckboxQuizAtom({
          nodeId: atom.id,
          nodeKey: nodeKey,
          rootKey: root.key,
          rootId: root.id,
          selectedIds: selectedIds,
        }).then(({ is_correct, feedbacks, video_feedback }) => {
          this.setState({
            isResultModalOpen: true,
            isCorrect: is_correct,
            feedbacks,
            video_feedback,
          });
          return this.props.updateUnstructuredUserStateData({
            rootKey: root.key,
            rootId: root.id,
            nodeKey,
            nodeId: atom.id,
            json: {
              selected_ids: selectedIds,
              is_correct: is_correct,
            },
          });
        });
      };

      render() {
        const { onFinish, atom, atoms, nodeKey } = this.props;
        const {
          selectedIds,
          isCorrect,
          isResultModalOpen,
          feedbacks,
          video_feedback,
        } = this.state;
        const uniqueFeedbacks = _.uniq(feedbacks);
        const { index, count } = AtomHelper.getQuestionNumberAndCount(
          nodeKey,
          atoms
        );

        return (
          <StaticContentPlaceholder
            placeholder={
              <div className={styles['prevent-clicking']}>
                <UreactCheckboxQuizAtom
                  atom={atom}
                  selectedIds={_.chain(atom.question.answers)
                    .filter('is_correct')
                    .map('id')
                    .value()}
                  index={index}
                  count={count}
                  isCorrect={true}
                />
              </div>
            }
          >
            <div>
              {isResultModalOpen ? (
                <ResultModal
                  isOpen={isResultModalOpen}
                  onRequestClose={() =>
                    this.setState({ isResultModalOpen: false })
                  }
                  onContinueOnSuccessfulResult={onFinish}
                  hasAnswer={true}
                  feedback={feedbacks ? uniqueFeedbacks.join('\n\n') : null}
                  video_feedback={video_feedback}
                  passed={isCorrect}
                />
              ) : null}
              <UreactCheckboxQuizAtom
                atom={atom}
                selectedIds={selectedIds}
                index={index}
                count={count}
                isCorrect={isCorrect}
                onAnswerChange={this.handleAnswerChange}
              />
              <div styleName="buttons">
                <Button
                  variant="primary"
                  disabled={_.isEmpty(selectedIds)}
                  onClick={this.handleSubmitClick}
                  label={__('Submit')}
                />
              </div>
            </div>
          </StaticContentPlaceholder>
        );
      }
    },
    styles
  )
);
