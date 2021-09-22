import React from 'react';

import Content from 'bundles/phoenix/components/Content';

import TextFeedbackTable from 'pages/open-course/peerReview/components/TextFeedbackTable';
import TextFeedbackRow from 'pages/open-course/peerReview/components/TextFeedbackRow';
import Review from 'pages/open-course/peerReview/reviewTypes/structured/models/review';
import ReviewSchemaPart from 'pages/open-course/peerReview/reviewTypes/structured/partTypes/multiLineInput/models/schema';

import 'css!./__styles__/MultiLineInputDisplayPart';

const ReviewRow: React.FC<{ reviewSchemaPart: typeof ReviewSchemaPart; review: Review }> = ({
  reviewSchemaPart,
  review,
}) => {
  const partId = reviewSchemaPart.get('id');
  const reviewPart = review.get('parts').get(partId);

  const reviewInput = reviewPart.get('input');
  const reviewMaxScore = reviewSchemaPart.get('points');
  const reviewScore = reviewMaxScore && (reviewPart.get('score') || '-');
  const creatorScore = (reviewMaxScore && `${reviewScore}/${reviewMaxScore}`) || null;
  const reviewCreator = review.get('creator');

  if (reviewInput || creatorScore) {
    return (
      <TextFeedbackRow
        creatorFullName={reviewCreator.get('fullName')}
        creatorPhotoUrl={reviewCreator.get('photoUrl')}
        isAnonymous={reviewCreator.get('isAnonymous')}
        creatorScore={creatorScore}
      >
        {reviewInput && <Content className="review-text" content={reviewInput} />}
      </TextFeedbackRow>
    );
  }

  return null;
};

type Props = {
  reviewSchemaPart: typeof ReviewSchemaPart;
  reviews: Array<Review>;
};

class MultiLineInputDisplayPart extends React.Component<Props> {
  render() {
    const { reviewSchemaPart, reviews } = this.props;

    return (
      <div className="rc-MultiLineInputDisplayPart">
        <Content assumeStringIsHtml={false} content={reviewSchemaPart.get('prompt')} />
        <TextFeedbackTable>
          {reviews.map((review) => (
            <ReviewRow key={review.get('id')} reviewSchemaPart={reviewSchemaPart} review={review} />
          ))}
        </TextFeedbackTable>
      </div>
    );
  }
}

export default MultiLineInputDisplayPart;
