import CMLUtils from 'bundles/cml/utils/CMLUtils';
import Feedback from './Feedback';

class LikeFeedback extends Feedback {
  constructor(value: $TSFixMe, active: $TSFixMe, comment: $TSFixMe) {
    const maxValue = 1;

    const feedback = {
      rating: { value, maxValue, active },

      comments: {
        generic: comment || CMLUtils.create(''),
      },
    };

    // @ts-ignore ts-migrate(2345) FIXME: Argument of type '{ rating: { value: any; maxValue... Remove this comment to see the full error message
    super(feedback);
  }

  get isLike() {
    return this.value === 1;
  }

  get isDislike() {
    return this.value === 0;
  }

  get isSelected() {
    return this.isActive;
  }

  get comment() {
    // @ts-expect-error ts-migrate(2551) FIXME: Property 'comments' does not exist on type 'LikeFe... Remove this comment to see the full error message
    return this.comments && this.comments.generic;
  }
}

export default LikeFeedback;
