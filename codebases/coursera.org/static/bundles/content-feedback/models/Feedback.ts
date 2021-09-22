/**
 * Feedback model
 */
class Feedback {
  constructor({ rating, comments, timestamp, context, debugInfo, categoryStates, id }: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'rating' does not exist on type 'Feedback... Remove this comment to see the full error message
    this.rating = rating;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'comments' does not exist on type 'Feedba... Remove this comment to see the full error message
    this.comments = comments;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'timestamp' does not exist on type 'Feedb... Remove this comment to see the full error message
    this.timestamp = timestamp;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'context' does not exist on type 'Feedbac... Remove this comment to see the full error message
    this.context = context;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'debugInfo' does not exist on type 'Feedb... Remove this comment to see the full error message
    this.debugInfo = debugInfo;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'categoryStates' does not exist on type '... Remove this comment to see the full error message
    this.categoryStates = categoryStates;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Feedback'.
    this.id = id;
  }

  get value() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'rating' does not exist on type 'Feedback... Remove this comment to see the full error message
    return this.rating.value;
  }

  get isActive() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'rating' does not exist on type 'Feedback... Remove this comment to see the full error message
    return this.rating.active;
  }

  get subItemId() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'context' does not exist on type 'Feedbac... Remove this comment to see the full error message
    return this.context && this.context.definition.subItemId;
  }

  get subItemTitle() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'context' does not exist on type 'Feedbac... Remove this comment to see the full error message
    return this.context && this.context.definition.subItemTitle;
  }

  toObject() {
    return {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'rating' does not exist on type 'Feedback... Remove this comment to see the full error message
      rating: this.rating,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'comments' does not exist on type 'Feedba... Remove this comment to see the full error message
      comments: this.comments,
    };
  }
}

export default Feedback;
