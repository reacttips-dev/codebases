import React from 'react';

import Content from 'bundles/phoenix/components/Content';
import TeamInlineFeedbackModal from 'pages/open-course/peerReview/reviewTypes/structured/partTypes/boxAnnotation/components/TeamInlineFeedbackModal';

import _t from 'i18n!nls/ondemand';

import type Review from 'pages/open-course/peerReview/reviewTypes/structured/models/review';
import type ReviewSchemaPart from 'pages/open-course/peerReview/reviewTypes/structured/partTypes/boxAnnotation/models/schema';

import 'css!./__styles__/BoxAnnotationDisplayPart';

type Props = {
  reviewSchemaPart: ReviewSchemaPart;
  reviews: Array<Review>;
};

type State = {
  showModal: boolean;
};

class BoxAnnotationDisplayPart extends React.Component<Props, State> {
  state = {
    showModal: false,
  };

  toggleModal = () => {
    const { showModal } = this.state;
    this.setState({ showModal: !showModal });
  };

  render() {
    const { reviewSchemaPart, reviews } = this.props;
    const { showModal } = this.state;
    const reviewPartId = reviewSchemaPart.id;
    const responseId = reviews[0].get('parts').get(reviewPartId).get('responseId');
    return (
      <div className="rc-BoxAnnotationDisplayPart">
        <Content assumeStringIsHtml={false} content={reviewSchemaPart.get('prompt')} />
        <button type="button" className="primary" onClick={this.toggleModal}>
          {_t('See More Feedback')}
        </button>
        {/*
        // @ts-expect-error TSMIGRATION */}
        {showModal && <TeamInlineFeedbackModal reviewResponseId={responseId} onCloseModal={this.toggleModal} />}
      </div>
    );
  }
}

export default BoxAnnotationDisplayPart;
