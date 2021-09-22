import React from 'react';
import Content from 'bundles/phoenix/components/Content';
import TextFeedbackTable from 'pages/open-course/peerReview/components/TextFeedbackTable';
import TextFeedbackRow from 'pages/open-course/peerReview/components/TextFeedbackRow';
import Review from 'pages/open-course/peerReview/reviewTypes/structured/models/review';
import ReviewSchemaPart from 'pages/open-course/peerReview/reviewTypes/structured/partTypes/singleLineInput/models/schema';
import 'css!./__styles__/SingleLineInputDisplayPart';

const ReviewRow = ({ reviewSchemaPart, review }) => {
  const partId = reviewSchemaPart.get('id');
  const reviewInput = review.get('parts').get(partId).get('input');
  const reviewCreator = review.get('creator');
  return (
    <TextFeedbackRow
      isAnonymous={reviewCreator.get('isAnonymous')}
      creatorFullName={reviewCreator.get('fullName')}
      creatorPhotoUrl={reviewCreator.get('photoUrl')}
    >
      <span className="review-text">{reviewInput}</span>
    </TextFeedbackRow>
  );
};

class SingleLineInputDisplayPart extends React.Component {
  static propTypes = {
    reviewSchemaPart: React.PropTypes.instanceOf(ReviewSchemaPart).isRequired,
    reviews: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Review)).isRequired,
  };

  render() {
    const { reviewSchemaPart, reviews } = this.props;

    return (
      <div className="rc-SingleLineInputDisplayPart">
        <Content content={reviewSchemaPart.get('prompt')} />
        <TextFeedbackTable>
          {reviews.map((review) => (
            <ReviewRow key={review.get('id')} reviewSchemaPart={reviewSchemaPart} review={review} />
          ))}
        </TextFeedbackTable>
      </div>
    );
  }
}

export default SingleLineInputDisplayPart;
