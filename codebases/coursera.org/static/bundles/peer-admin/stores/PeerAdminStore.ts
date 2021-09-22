import { PeerReviewSubmission } from 'bundles/authoring/common/types/PeerReviewSubmission';

import _ from 'underscore';
import BaseStore, { Dispatcher } from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';

const SERIALIZED_PROPS: Array<keyof PeerAdminStoreDehydratedState> = [
  'rows',
  'next',
  'total',
  'hasNext',
  'hasPrevious',
];

type PeerAdminStoreDehydratedState = {
  rows: Array<PeerReviewSubmission>;
  next: number;
  total: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

class PeerAdminStore extends BaseStore {
  static storeName = 'PeerAdminStore';

  static handlers = {
    RECEIVE_ROWS: 'onReceiveRows',
    RECEIVE_RANGE: 'onReceiveRange',
  };

  onReceiveRows(rows: Array<PeerReviewSubmission>) {
    this.rows = rows;
    this.emitChange();
  }

  onReceiveRange({ next, total, start }: { next: number; total: number; start: number }) {
    this.next = next;
    this.total = total;

    this.hasPrevious = start > 0;
    this.hasNext = next < this.total;

    this.emitChange();
  }

  rows: Array<PeerReviewSubmission>;

  next: number;

  total: number;

  hasNext: boolean;

  hasPrevious: boolean;

  constructor(dispatcher: Dispatcher) {
    super(dispatcher);

    this.rows = [];
    this.next = 0;
    this.total = 0;
    this.hasNext = false;
    this.hasPrevious = false;
  }

  dehydrate(): PeerAdminStoreDehydratedState {
    return _(this).pick(...SERIALIZED_PROPS);
  }

  rehydrate(state: PeerAdminStoreDehydratedState) {
    Object.assign(this, _(state).pick(...SERIALIZED_PROPS));
  }

  getRows(): Array<PeerReviewSubmission> {
    return this.rows;
  }

  hasNextPage(): boolean {
    return this.hasNext;
  }

  hasPreviousPage(): boolean {
    return this.hasPrevious;
  }

  getTotal(): number {
    return this.total;
  }

  getNext(): number {
    return this.next;
  }
}

export default PeerAdminStore;
