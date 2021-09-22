import PropTypes from 'prop-types';
import React from 'react';
import Naptime from 'bundles/naptimejs';
import CMLUtils from 'bundles/cml/utils/CMLUtils';
import MyFeedback from 'bundles/naptimejs/resources/myFeedback.v1';
import TrackedButton from 'bundles/page/components/TrackedButton';
import SelectizeTokenizer from 'bundles/ondemand/components/common/SelectizeTokenizer';
import CourseDerivativesV1 from 'bundles/naptimejs/resources/courseDerivatives.v1';
import _t from 'i18n!nls/ondemand';
import 'css!./__styles__/NpsContent';

class NpsContent extends React.Component {
  static propTypes = {
    feedbackSystem: PropTypes.string.isRequired,
    handleCompleteFeedback: PropTypes.func.isRequired,
    courseId: PropTypes.string.isRequired,
    courseDerivatives: PropTypes.instanceOf(CourseDerivativesV1).isRequired,
  };

  static contextTypes = {
    executeMutation: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      comment: CMLUtils.create('', 'feedback/1'),
      score: 0,
    };
  }

  handleSendFeedback = () => {
    if (!CMLUtils.isEmpty(this.state.comment)) {
      // we only want to submit if there is actually a comment
      this.submitFeedback(this.state.score).done();
    }
    this.props.handleCompleteFeedback();
  };

  onSkillsChange = (newValue) => {
    const comment = CMLUtils.create(`<co-content><text>${newValue}</text></co-content>`, 'feedback/1');
    this.setState({ comment });
  };

  submitFeedback = (score) => {
    const { courseId, feedbackSystem } = this.props;
    const submitFeedbackParams = { courseId, feedbackSystem };

    const submitFeedbackBody = {
      rating: {
        value: score,
        maxValue: 10,
        active: false,
      },
    };

    // the comments field should not be included in body if empty
    if (!CMLUtils.isEmpty(this.state.comment)) {
      submitFeedbackBody.comments = { NPS_REASON: this.state.comment };
    }

    return this.context.executeMutation(MyFeedback.action('submit', submitFeedbackBody, submitFeedbackParams));
  };

  render() {
    const { courseDerivatives } = this.props;
    const trackingData = { feedbackSystem: this.props.feedbackSystem };
    const selectizeOptions = {
      persist: false,
      openOnFocus: false,
      create: true,
      highlight: true,
      closeAfterSelect: true,
      placeholder: _t('List the skills you have learned'),
      valueField: 'skillName',
      labelField: 'skillName',
      searchField: ['skillName'],
      onType(str) {
        if (str === '') {
          this.close();
        }
      },
      options: courseDerivatives.skillTags,
    };

    return (
      <div className="rc-NpsContent">
        <div className="feedback-prompt headline-3-text">{_t('What skills have you learned in this course?')}</div>
        <div className="nps-skills-tokenizer">
          <SelectizeTokenizer selectizeOptions={selectizeOptions} onChange={this.onSkillsChange} />
        </div>
        <TrackedButton
          trackingName="nps_feedback_button"
          className="nps-submit-button primary"
          onClick={this.handleSendFeedback}
          data={trackingData}
        >
          {_t('Submit')}
        </TrackedButton>
      </div>
    );
  }
}

export default Naptime.createContainer(NpsContent, (props) => ({
  courseDerivatives: CourseDerivativesV1.get(props.courseId, {
    fields: ['skillTags'],
  }),
}));
