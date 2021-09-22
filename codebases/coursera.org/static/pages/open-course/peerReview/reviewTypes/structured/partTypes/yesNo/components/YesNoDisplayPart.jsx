import React from 'react';
import Content from 'bundles/phoenix/components/Content';
import FeedbackPointsDisplay from 'pages/open-course/peerReview/components/FeedbackPointsDisplay';
import OptionFeedbackTable from 'pages/open-course/peerReview/components/OptionFeedbackTable';
import OptionFeedbackRow from 'pages/open-course/peerReview/components/OptionFeedbackRow';
import Review from 'pages/open-course/peerReview/reviewTypes/structured/models/review';
import reviewsSummaryShape from 'pages/open-course/peerReview/reviewTypes/structured/models/reviewsSummaryShape';
import ReviewSchemaPart from 'pages/open-course/peerReview/reviewTypes/structured/partTypes/yesNo/models/schema';

class YesNoDisplayPart extends React.Component {
  static propTypes = {
    reviewSchemaPart: React.PropTypes.instanceOf(ReviewSchemaPart).isRequired,
    reviewsSummary: reviewsSummaryShape,
    reviews: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Review)).isRequired,
  };

  render() {
    const { reviewSchemaPart, reviewsSummary, reviews } = this.props;

    const choices = ['Yes', 'No'];
    const partId = reviewSchemaPart.get('id');

    const getReviewChoice = (review) => review.get('parts').get(partId).get('choice');

    const getReviewsForChoice = (choice) => {
      return reviews.filter((review) => review.get('parts').get(partId).get('choice') === choice);
    };

    const reviewChoices = reviews.map(getReviewChoice);
    const reviewsSummaryPart = reviewsSummary && reviewsSummary.definition.parts[partId];
    const reviewsSummaryScore = reviewsSummaryPart && reviewsSummaryPart.score;
    const checkedChoice = reviewSchemaPart.getChoiceBestRepresentingReviews(reviewChoices, reviewsSummaryScore);

    const optionRows = choices.map((choice) => {
      const reviewersForChoice = getReviewsForChoice(choice).map((review) => review.get('creator'));
      const points = reviewSchemaPart.getChoicePoints(choice);
      const checked = choice === checkedChoice;
      return (
        <OptionFeedbackRow
          reviewers={reviewersForChoice}
          checked={checked}
          groupId={partId}
          optionId={choice}
          key={choice}
        >
          {reviewSchemaPart.get('points') && (
            <div>
              <FeedbackPointsDisplay actualPoints={checked ? reviewsSummaryScore : undefined} points={points} />
            </div>
          )}
          {choice}
        </OptionFeedbackRow>
      );
    });

    return (
      <div className="rc-YesNoDisplayPart">
        <Content content={reviewSchemaPart.get('prompt')} />
        <OptionFeedbackTable>{optionRows}</OptionFeedbackTable>
      </div>
    );
  }
}

export default YesNoDisplayPart;
