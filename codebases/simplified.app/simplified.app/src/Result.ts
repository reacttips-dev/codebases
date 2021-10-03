/*
egjs-list-differ
Copyright (c) 2019-present NAVER Corp.
MIT license
*/
import Link from "./Link";

function orderChanged(changed: number[][], fixed: boolean[]) {
  // It is roughly in the order of these examples.
  // 4, 6, 0, 2, 1, 3, 5, 7
  const fromLinks: Link[] = [];
  // 0, 1, 2, 3, 4, 5, 6, 7
  const toLinks: Link[] = [];

  changed.forEach(([from, to]) => {
    const link = new Link();

    fromLinks[from] = link;
    toLinks[to] = link;
  });
  // `fromLinks` are connected to each other by double linked list.
  fromLinks.forEach((link, i) => {
    link.connect(fromLinks[i - 1]);
  });

  return changed.filter((_, i) => !fixed[i]).map(([from, to], i) => {
    if (from === to) {
      return [0, 0];
    }
    const fromLink = fromLinks[from];
    const toLink = toLinks[to - 1];
    const fromIndex = fromLink.getIndex();

    // Disconnect the link connected to `fromLink`.
    fromLink.disconnect();

    // Connect `fromLink` to the right of `toLink`.
    if (!toLink) {
      fromLink.connect(undefined, fromLinks[0]);
    } else {
      fromLink.connect(toLink, toLink.next);
    }
    const toIndex = fromLink.getIndex();
    return [fromIndex, toIndex];
  });
}

export default class Result<T = any> {
  public prevList: T[];
  public list: T[];
  public added: number[];
  public removed: number[];
  public changed: number[][];
  public maintained: number[][];
  private changedBeforeAdded: number[][];
  private fixed: boolean[];

  private cacheOrdered: number[][];
  private cachePureChanged: number[][];
  constructor(
    prevList: T[],
    list: T[],
    added: number[],
    removed: number[],
    changed: number[][],
    maintained: number[][],
    changedBeforeAdded: number[][],
    fixed: boolean[],
  ) {
    this.prevList = prevList;
    this.list = list;
    this.added = added;
    this.removed = removed;
    this.changed = changed;
    this.maintained = maintained;
    this.changedBeforeAdded = changedBeforeAdded;
    this.fixed = fixed;
  }
  get ordered(): number[][] {
    if (!this.cacheOrdered) {
      this.caculateOrdered();
    }
    return this.cacheOrdered;
  }
  get pureChanged(): number[][] {
    if (!this.cachePureChanged) {
      this.caculateOrdered();
    }
    return this.cachePureChanged;
  }
  private caculateOrdered() {
    const ordered = orderChanged(this.changedBeforeAdded, this.fixed);
    const changed: number[][] = this.changed;
    const pureChanged: number[][] = [];

    this.cacheOrdered = ordered.filter(([from, to], i) => {
      const [fromBefore, toBefore] = changed[i];

      if (from !== to) {
        pureChanged.push([fromBefore, toBefore]);
        return true;
      }
    });
    this.cachePureChanged = pureChanged;
  }
}
