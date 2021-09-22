import CMLUtils from 'bundles/cml/utils/CMLUtils';
import Feedback from './Feedback';

class RatingFeedback extends Feedback {
  constructor(value: $TSFixMe, active: $TSFixMe, comment?: $TSFixMe, timestamp?: $TSFixMe, id?: $TSFixMe) {
    const maxValue = 5;

    const feedback = {
      rating: { value, maxValue, active },
      comments: comment && !CMLUtils.isEmpty(comment) ? { generic: comment } : {},
      timestamp,
      id,
    };

    super(feedback);
  }

  get comment() {
    // @ts-expect-error ts-migrate(2551) FIXME: Property 'comments' does not exist on type 'Rating... Remove this comment to see the full error message
    return this.comments && this.comments.generic;
  }

  hasComment() {
    return this.comment && !CMLUtils.isEmpty(this.comment);
  }
}

export default RatingFeedback;
