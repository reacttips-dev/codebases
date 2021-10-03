/*
egjs-list-differ
Copyright (c) 2019-present NAVER Corp.
MIT license
*/
export default class HashMap<T> {
  private object = {};
  public get(key: number | string): T {
    return this.object[key];
  }
  public set(key: number | string, value: T) {
    this.object[key] = value;
  }
};

