/* Defines the model for a grading late penalty */

import { LATE_PENALTY_TYPE } from 'bundles/author-common/constants/GradingLatePenalty';
import type {
  GradingLatePenaltyFixedGradingLatePenalty,
  GradingLatePenaltyIncrementalGradingLatePenalty,
} from 'bundles/naptimejs/resources/__generated__/OnDemandCourseMaterialItemsV1';

export type GradingLatePenaltyType =
  | GradingLatePenaltyFixedGradingLatePenalty
  | GradingLatePenaltyIncrementalGradingLatePenalty;

/**
 * @deprecated It is used for old fixed/incremental late penalties, we migrated from them to the more complex compount late penalty.
 */
class GradingLatePenalty {
  _typeName?: typeof LATE_PENALTY_TYPE[keyof typeof LATE_PENALTY_TYPE];

  _penalty?: number;

  constructor({ typeName, definition }: GradingLatePenaltyType) {
    if (!typeName) {
      return;
    }

    this._typeName = typeName;
    if ('penalty' in definition) {
      this._penalty = definition.penalty;
    }
  }

  /** @deprecated */
  get penalty(): number | undefined {
    return this._penalty;
  }

  /** @deprecated */
  get isIncremental(): boolean {
    return this._typeName === LATE_PENALTY_TYPE.INCREMENTAL;
  }

  /** @deprecated */
  get isFixed(): boolean {
    return this._typeName === LATE_PENALTY_TYPE.FIXED;
  }

  /** @deprecated */
  get penaltyPercentage(): number {
    return this.penalty ? Math.floor(this.penalty * 100) : 0;
  }

  /**
   * Penalty copy to show to learners
   * @deprecated
   * */
  get learnerLabel(): string {
    const label = `A penalty of ${this.penaltyPercentage}% will be applied to your score {policy} after the deadline`;
    let policy = '';

    if (this.isIncremental) {
      policy = 'per late day';
    } else if (this.isFixed) {
      policy = 'any time you submit';
    }

    return label.replace('{policy}', policy);
  }

  /** @deprecated */
  toJson() {
    return {
      typeName: this._typeName,
      definition: {
        penalty: this._penalty,
      },
    };
  }
}

export default GradingLatePenalty;
