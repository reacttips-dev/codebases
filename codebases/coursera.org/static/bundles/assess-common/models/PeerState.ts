// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import Evaluation from 'bundles/phoenix/models/evaluation';

import type ItemMetadata from 'pages/open-course/common/models/itemMetadata';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type Progress from 'pages/open-course/common/models/progress';

/**
 * Methods for reading the state in peer review's ItemProgress objects.
 */
class PeerState {
  itemMetadata: ItemMetadata;

  itemProgress: Progress;

  constructor(itemMetadata: ItemMetadata, itemProgress: Progress) {
    this.itemMetadata = itemMetadata;
    this.itemProgress = itemProgress;
  }

  getEvaluation() {
    return new Evaluation(this.itemProgress.getDefinition('evaluation'));
  }

  isEvaluated() {
    return this.getEvaluation().isDefined();
  }

  isFailed() {
    return this.isEvaluated() && this.getEvaluation().isFailed();
  }

  isPassed() {
    return this.isEvaluated() && this.getEvaluation().isPassed();
  }

  isReviewingComplete() {
    return this.reviewCount() >= this.requiredReviewCount();
  }

  isSubmitted() {
    return !!this.itemProgress.getDefinition('submitted');
  }

  remainingReviewCount() {
    return this.requiredReviewCount() - this.reviewCount();
  }

  requiredReviewCount() {
    return (
      this.itemProgress.getDefinition('requiredReviewCount') ||
      this.itemMetadata.getDefinition('requiredReviewCount') ||
      0
    );
  }

  reviewCount() {
    return this.itemProgress.getDefinition('reviewCount') || 0;
  }
}

export default PeerState;
