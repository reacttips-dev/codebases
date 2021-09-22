import _ from 'underscore';
import RatingFeedback from './RatingFeedback';

class RatingCollection {
  constructor() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'models' does not exist on type 'RatingCo... Remove this comment to see the full error message
    this.models = [];
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'page' does not exist on type 'RatingColl... Remove this comment to see the full error message
    this.page = 0;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'totalCount' does not exist on type 'Rati... Remove this comment to see the full error message
    this.totalCount = 0;
  }

  get length() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'models' does not exist on type 'RatingCo... Remove this comment to see the full error message
    return this.models.length;
  }

  get hasPendingPage() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'totalCount' does not exist on type 'Rati... Remove this comment to see the full error message
    return this.totalCount !== this.length;
  }

  isEmpty() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'models' does not exist on type 'RatingCo... Remove this comment to see the full error message
    return this.models.length === 0;
  }

  setTotalCount(count: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'totalCount' does not exist on type 'Rati... Remove this comment to see the full error message
    this.totalCount = count;
  }

  appendPage(feedbacks: $TSFixMe) {
    _(feedbacks).each((feedback) => {
      const { rating, timestamp, id } = feedback;
      const ratingFeedback = new RatingFeedback(rating.value, rating.active, feedback.comments.generic, timestamp, id);

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'models' does not exist on type 'RatingCo... Remove this comment to see the full error message
      this.models.push(ratingFeedback);
    });

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'page' does not exist on type 'RatingColl... Remove this comment to see the full error message
    this.page += 1;
  }
}

export default RatingCollection;
