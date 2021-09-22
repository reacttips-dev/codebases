/* eslint-disable no-restricted-imports */
import type ItemMetadata from 'pages/open-course/common/models/itemMetadata';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type Progress from 'pages/open-course/common/models/progress';

class WiseFlowState {
  itemMetadata: ItemMetadata;

  itemProgress: Progress;

  constructor(itemMetadata: ItemMetadata, itemProgress: Progress) {
    this.itemMetadata = itemMetadata;
    this.itemProgress = itemProgress;
  }

  isCompleted(): boolean {
    return this.itemProgress.isComplete();
  }

  isSubmitted(): boolean {
    const submittedAt = this.itemProgress.getDefinition('submittedAt');
    return this.itemProgress.hasStarted() && submittedAt;
  }

  isStarted(): boolean {
    const submittedAt = this.itemProgress.getDefinition('submittedAt');
    return this.itemProgress.hasStarted() && !submittedAt;
  }
}

export default WiseFlowState;
