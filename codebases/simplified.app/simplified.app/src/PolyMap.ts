/*
egjs-list-differ
Copyright (c) 2019-present NAVER Corp.
MIT license
*/
export default class PolyMap<T> {
  private keys: T[] = [];
  private values: number[] = [];
  public get(key: T): number {
    return this.values[this.keys.indexOf(key)];
  }
  public set(key: T, value: number) {
    const keys = this.keys;
    const values = this.values;
    const prevIndex = keys.indexOf(key);
    const index = prevIndex === -1 ? keys.length : prevIndex;

    keys[index] = key;
    values[index] = value;
  }
}
