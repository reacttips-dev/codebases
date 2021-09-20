import { Checkbox } from '@udacity/veritas-components';
import ClassroomPropTypes from 'components/prop-types';
import Markdown from '@udacity/ureact-markdown';
import PropTypes from 'prop-types';
import ResultModal from 'components/atoms/common/result-modal';
import { actionsBinder } from 'helpers/action-helper';
import { connect } from 'react-redux';
import styles from './task-list-atom.scss';

export default connect(
  null,
  actionsBinder('updateUnstructuredUserStateData')
)(
  cssModule(
    class extends React.Component {
      static displayName = 'atoms/task-list-atom';

      static propTypes = {
        nodeKey: PropTypes.string.isRequired,
        atom: ClassroomPropTypes.taskListAtom.isRequired,
        unstructuredData: PropTypes.object,
        onFinish: PropTypes.func,
      };

      static contextTypes = {
        root: ClassroomPropTypes.node,
      };

      static defaultProps = {
        unstructuredData: null,
        onFinish: _.noop,
      };

      constructor(props) {
        super(props);
        var unstructuredData = props.unstructuredData || {};

        this.state = {
          selectedIds: unstructuredData.selected_ids || [],
          isFeedbackModalOpen: false,
        };
      }

      _persistState = () => {
        var { root } = this.context;
        var { selectedIds } = this.state;
        var { atom, nodeKey } = this.props;

        return this.props.updateUnstructuredUserStateData({
          rootKey: root.key,
          rootId: root.id,
          nodeKey,
          nodeId: atom.id,
          json: {
            selected_ids: selectedIds,
          },
        });
      };

      handleCheckboxClick = (selectedIndex, event) => {
        var { selectedIds } = this.state;
        var { atom } = this.props;

        if (event.target.checked) {
          selectedIds = _.concat(selectedIds, [selectedIndex]);
        } else {
          selectedIds = _.difference(selectedIds, [selectedIndex]);
        }

        var isFeedbackModalOpen = selectedIds.length === atom.tasks.length;

        this.setState(
          {
            selectedIds: selectedIds,
            isFeedbackModalOpen: isFeedbackModalOpen,
          },
          this._persistState
        );
      };

      render() {
        var { atom, onFinish } = this.props;
        var { selectedIds, isFeedbackModalOpen } = this.state;

        return (
          <div>
            <ResultModal
              isOpen={isFeedbackModalOpen}
              onRequestClose={() =>
                this.setState({ isFeedbackModalOpen: false })
              }
              onContinueOnSuccessfulResult={onFinish}
              hasAnswer={true}
              feedback={atom.positive_feedback}
              video_feedback={atom.video_feedback}
              passed={true}
            />

            <div styleName="container">
              {atom.title || atom.description ? (
                <header styleName="header">
                  {atom.title ? <h3 styleName="title">{atom.title}</h3> : null}
                  {atom.description ? (
                    <h5 styleName="description">
                      <Markdown text={atom.description} />
                    </h5>
                  ) : null}
                </header>
              ) : null}
              <div styleName="tasks-container">
                <span styleName="icon-container">Task List</span>
                <ul styleName="tasks-checkbox-container">
                  {_.map(atom.tasks || [], (task, index) => {
                    return (
                      <li styleName="task-checkbox-item">
                        <Checkbox
                          id={`${atom.id}--${index}`}
                          key={index}
                          defaultChecked={_.includes(selectedIds, index)}
                          onChange={(event) =>
                            this.handleCheckboxClick(index, event)
                          }
                          label={<Markdown text={task} />}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        );
      }
    },
    styles
  )
);
