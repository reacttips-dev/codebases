import React from 'react';
import Content from 'bundles/phoenix/components/Content';
import FeedbackPointsDisplay from 'pages/open-course/peerReview/components/FeedbackPointsDisplay';
import OptionFeedbackTable from 'pages/open-course/peerReview/components/OptionFeedbackTable';
import OptionFeedbackRow from 'pages/open-course/peerReview/components/OptionFeedbackRow';
import Review from 'pages/open-course/peerReview/reviewTypes/structured/models/review';
import reviewsSummaryShape from 'pages/open-course/peerReview/reviewTypes/structured/models/reviewsSummaryShape';
import ReviewSchemaPart from 'pages/open-course/peerReview/reviewTypes/structured/partTypes/options/models/schema';

class OptionsDisplayPart extends React.Component {
  static propTypes = {
    reviewSchemaPart: React.PropTypes.instanceOf(ReviewSchemaPart).isRequired,
    reviewsSummary: reviewsSummaryShape,
    reviews: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Review)).isRequired,
  };

  render() {
    const { reviewSchemaPart, reviewsSummary, reviews } = this.props;

    const partId = reviewSchemaPart.get('id');
    const options = reviewSchemaPart.getSortedOptions();

    const getReviewChoice = (review) => review.get('parts').get(partId).get('choice');

    const getReviewsForOptionId = (optionId) => {
      return reviews.filter((review) => getReviewChoice(review) === optionId);
    };

    const reviewChoices = reviews.map(getReviewChoice);
    const reviewsSummaryPart = reviewsSummary && reviewsSummary.definition.parts[partId];
    const reviewsSummaryScore = reviewsSummaryPart && reviewsSummaryPart.score;
    const checkedOption = reviewSchemaPart.getOptionBestRepresentingReviews(reviewChoices, reviewsSummaryScore);
    const checkedOptionId = checkedOption && checkedOption.optionId;

    const optionRows = options.map((option) => {
      const optionId = option.optionId;
      const reviewersForOption = getReviewsForOptionId(optionId).map((review) => review.get('creator'));
      const checked = optionId === checkedOptionId;
      return (
        <OptionFeedbackRow
          reviewers={reviewersForOption}
          checked={checked}
          groupId={partId}
          optionId={optionId}
          key={optionId}
        >
          {reviewSchemaPart.get('isScored') && (
            <div>
              <FeedbackPointsDisplay actualPoints={checked ? reviewsSummaryScore : undefined} points={option.points} />
            </div>
          )}
          <Content content={option.display} />
        </OptionFeedbackRow>
      );
    });

    return (
      <div className="rc-OptionsDisplayPart">
        <Content content={reviewSchemaPart.get('prompt')} />
        <OptionFeedbackTable>{optionRows}</OptionFeedbackTable>
      </div>
    );
  }
}

export default OptionsDisplayPart;
