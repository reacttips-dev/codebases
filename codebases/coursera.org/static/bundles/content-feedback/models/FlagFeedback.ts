import keysToConstants from 'js/lib/keysToConstants';
import Feedback from './Feedback';

class FlagFeedback extends Feedback {
  static statuses = keysToConstants(['UNRESOLVED', 'TODO', 'RESOLVED', 'ARCHIVED']);

  constructor(
    active: $TSFixMe,
    comments: $TSFixMe,
    timestamp: $TSFixMe,
    context: $TSFixMe,
    debugInfo: $TSFixMe,
    categoryStates: $TSFixMe,
    id: $TSFixMe
  ) {
    const maxValue = 0;
    const value = 0;

    const feedback = {
      rating: { value, maxValue, active },
      comments: comments || {},
      timestamp,
      context,
      debugInfo,
      categoryStates,
      id,
    };

    super(feedback);
  }

  getComment(flagCategory: $TSFixMe) {
    if (flagCategory.isHelpfulOrConfused()) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'comments' does not exist on type 'FlagFe... Remove this comment to see the full error message
      return this.comments.generic;
    }
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'comments' does not exist on type 'FlagFe... Remove this comment to see the full error message
    return this.comments[flagCategory.id];
  }

  getStatus(flagCategory: $TSFixMe) {
    if (flagCategory.isHelpfulOrConfused()) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'categoryStates' does not exist on type '... Remove this comment to see the full error message
      return this.categoryStates.generic && this.categoryStates.generic.status;
    }
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'categoryStates' does not exist on type '... Remove this comment to see the full error message
    return this.categoryStates[flagCategory.id] && this.categoryStates[flagCategory.id].status;
  }

  setStatus(flagCategory: $TSFixMe, status: $TSFixMe) {
    if (flagCategory.isHelpfulOrConfused()) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'categoryStates' does not exist on type '... Remove this comment to see the full error message
      this.categoryStates.generic = { status };
    }
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'categoryStates' does not exist on type '... Remove this comment to see the full error message
    this.categoryStates[flagCategory.id] = { status };
  }
}

export default FlagFeedback;

export const { statuses } = FlagFeedback;
