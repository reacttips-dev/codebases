import { Button, RoundButton } from '@udacity/veritas-components';
import { IconCheck, IconEmail } from '@udacity/veritas-icons';
import ClassroomPropTypes from 'components/prop-types';
import CocoHelper from 'helpers/coco-helper';
import Edit from 'components/common/edit';
import Header from 'components/common/header';
import LessonPreviewContainer from 'components/lesson-preview/lesson-preview-container';
import NanodegreeHelper from 'helpers/nanodegree-helper';
import NodeHelper from 'helpers/node-helper';
import PropTypes from 'prop-types';
import Responsive from 'components/common/responsive';
import { __ } from 'services/localization-service';
import { connect } from 'react-redux';
import styles from './_header.scss';
import withFeedbackContext from 'components/content-feedback/with-feedback-context';

const mapStateToProps = (state) => {
  const { inLessonPreviewMode, previewLessonUrl } = state.lessonPreview;

  return {
    hasUdacityEmail: CocoHelper.hasUdacityEmail(state),
    inLessonPreviewMode,
    previewLessonUrl,
  };
};

class ConceptHeader extends React.Component {
  static displayName = 'concepts/show/_header';

  static propTypes = {
    concept: ClassroomPropTypes.concept.isRequired,
    lesson: ClassroomPropTypes.lesson.isRequired,
    onToggleContentSelection: PropTypes.func,
    isSelectingContent: PropTypes.bool,

    // connect
    hasUdacityEmail: PropTypes.bool.isRequired,

    // lesson preview mode for curriculum managers to 'import' lessons in google docs
    inLessonPreviewMode: PropTypes.bool,
    previewLessonUrl: PropTypes.string,
  };

  static contextTypes = {
    part: PropTypes.object,
    root: PropTypes.object,
  };

  static defaultProps = {
    isPreviousDisabled: false,
  };

  _renderFeedbackButton() {
    const {
      isSelectingContent,
      onStartContentSelection,
      onCancelContentSelection,
    } = this.props;

    return isSelectingContent ? (
      <div>
        <Responsive type="from-tablet">
          <Button
            onClick={onCancelContentSelection}
            small={true}
            variant="primary"
            label={__('Cancel')}
          />
        </Responsive>
        <Responsive type="until-tablet">
          <RoundButton
            onClick={onCancelContentSelection}
            variant="minimal-inverse"
            icon={<IconCheck color="cerulean" />}
          />
        </Responsive>
      </div>
    ) : (
      <div>
        <Responsive type="from-tablet">
          <Button
            onClick={onStartContentSelection}
            small={true}
            variant="minimal-inverse"
            label={__('Send Feedback')}
          />
        </Responsive>
        <Responsive type="until-tablet">
          <RoundButton
            onClick={onStartContentSelection}
            variant="minimal-inverse"
            icon={<IconEmail color="cerulean" />}
          />
        </Responsive>
      </div>
    );
  }

  _renderRightNode() {
    const { hasUdacityEmail, inLessonPreviewMode } = this.props;
    const { root } = this.context;

    if (inLessonPreviewMode) {
      return null;
    }

    return (
      <div styleName="right-node">
        {hasUdacityEmail && <Edit />}
        {!NanodegreeHelper.isStatic(root) ? this._renderFeedbackButton() : null}
      </div>
    );
  }

  render() {
    const { concept } = this.props;
    const title = NodeHelper.getTitle(concept) || '';
    const { inLessonPreviewMode, previewLessonUrl } = this.props;

    return (
      <div data-test="concept-header">
        {inLessonPreviewMode && (
          <LessonPreviewContainer url={previewLessonUrl} />
        )}
        <Header
          justify="between"
          theme="dark"
          title={title}
          hamburgerAlwaysVisible={true}
        >
          {/* hack: CLAS-3444 Arabic translations missing - remove when received} */}
          {this._renderRightNode()}
        </Header>
      </div>
    );
  }
}

export default connect(mapStateToProps)(
  withFeedbackContext(cssModule(ConceptHeader, styles))
);
