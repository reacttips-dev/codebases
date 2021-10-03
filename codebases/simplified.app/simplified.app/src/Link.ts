/*
egjs-list-differ
Copyright (c) 2019-present NAVER Corp.
MIT license
*/
export default class Link {
  prev?: Link;
  next?: Link;

  public connect(prevLink?: Link, nextLink?: Link) {
    this.prev = prevLink;
    this.next = nextLink;

    prevLink && (prevLink.next = this);
    nextLink && (nextLink.prev = this);
  }
  public disconnect() {
    // In double linked list, diconnect the interconnected relationship.
    const prevLink = this.prev;
    const nextLink = this.next;
    prevLink && (prevLink.next = nextLink);
    nextLink && (nextLink.prev = prevLink);
  }
  public getIndex() {
    let link: Link | undefined = this;
    let index = -1;

    while (link) {
      link = link.prev;
      ++index;
    }
    return index;
  }
}
