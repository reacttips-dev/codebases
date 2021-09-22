import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

import Naptime from 'bundles/naptimejs';

import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import Modal from 'bundles/phoenix/components/Modal';

import NpsContent from 'bundles/course-v2/components/nps/NpsContent';

import MyFeedbackV1 from 'bundles/naptimejs/resources/myFeedback.v1';

import _t from 'i18n!nls/ondemand';

import 'css!./__styles__/NpsModal';

type Props = {
  courseId: string;
  feedbackSystem: string;
  followupSurveyLink: string;
  existingFeedback?: Array<any>;
  showFollowupQuestion?: boolean;
};

type State = {
  showModal: boolean;
};

class NpsModal extends React.Component<Props, State> {
  static contextTypes = {
    executeMutation: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      showModal: props.existingFeedback.length === 0,
    };
  }

  handleCompleteFeedback = () => {
    setTimeout(() => this.setState({ showModal: false }), 3000);
  };

  handleDismiss = () => {
    const { courseId, feedbackSystem } = this.props;
    const { executeMutation } = this.context;

    this.setState({ showModal: false });

    return executeMutation(
      MyFeedbackV1.action(
        'submit',
        {
          rating: {
            value: 0,
            maxValue: 10,
            active: false,
          },
        },
        {
          feedbackSystem,
          courseId,
        }
      )
    ).done();
  };

  render() {
    const { courseId, feedbackSystem } = this.props;
    const { showModal } = this.state;

    return (
      <div className="rc-NpsModal">
        {showModal && (
          <CSSTransitionGroup
            transitionAppear={true}
            transitionAppearTimeout={500}
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}
            transitionName="nps-feedback"
          >
            <Modal
              type="popup"
              trackingName="nps_modal"
              handleClose={this.handleDismiss}
              modalName={_t('What skills have you learned in this course?')}
            >
              <div className="nps-content">
                <NpsContent
                  courseId={courseId}
                  feedbackSystem={feedbackSystem}
                  handleCompleteFeedback={this.handleCompleteFeedback}
                />
              </div>
            </Modal>
          </CSSTransitionGroup>
        )}
      </div>
    );
  }
}

export default _.compose(
  Naptime.createContainer(({ courseId, feedbackSystem }: any) => {
    return {
      existingFeedback: MyFeedbackV1.finder('byCourseAndFeedback', {
        params: {
          courseIds: courseId,
          feedbackSystem,
        },
      }),
    };
  })
)(NpsModal);
