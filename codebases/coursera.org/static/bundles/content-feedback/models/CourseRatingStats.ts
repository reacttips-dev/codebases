import _ from 'underscore';

/**
 * Course rating stats
 */
class CourseRatingStats {
  constructor(counts: $TSFixMe, overrides: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'counts' does not exist on type 'CourseRa... Remove this comment to see the full error message
    this.counts = counts;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'totalCount' does not exist on type 'Cour... Remove this comment to see the full error message
    this.totalCount = 0;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'averageRating' does not exist on type 'C... Remove this comment to see the full error message
    this.averageRating = 0;

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'counts' does not exist on type 'CourseRa... Remove this comment to see the full error message
    _(this.counts).each((value, key) => {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'totalCount' does not exist on type 'Cour... Remove this comment to see the full error message
      this.totalCount = this.totalCount + value;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'averageRating' does not exist on type 'C... Remove this comment to see the full error message
      this.averageRating = this.averageRating + key * value;
    });

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'averageRating' does not exist on type 'C... Remove this comment to see the full error message
    this.averageRating = parseFloat((this.averageRating / this.totalCount).toFixed(1));

    if (overrides) {
      Object.assign(this, overrides);
    }
  }

  getCount(ratingValue: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'counts' does not exist on type 'CourseRa... Remove this comment to see the full error message
    return this.counts[ratingValue.value] || 0;
  }

  getPercent(ratingValue: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'totalCount' does not exist on type 'Cour... Remove this comment to see the full error message
    if (!this.totalCount) {
      return 0;
    }

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'totalCount' does not exist on type 'Cour... Remove this comment to see the full error message
    return Math.round((this.getCount(ratingValue) / this.totalCount) * 100);
  }
}

export default CourseRatingStats;
