import {
  BoardTableViewFilter,
  CardFilterCriteria,
} from './BoardTableViewFilter';

export class ListFilter extends Set<string> implements BoardTableViewFilter {
  filterLength() {
    return this.size;
  }

  isEmpty(): boolean {
    return this.filterLength() === 0;
  }

  isEnabled(idList: string) {
    return this.has(idList);
  }

  disable(idList: string) {
    this.delete(idList);
  }

  enable(idList: string) {
    this.add(idList);
  }

  toggle(idList: string) {
    if (this.isEnabled(idList)) {
      this.disable(idList);
    } else {
      this.enable(idList);
    }

    // Returns a new instance so that we can use it for `setState`.
    return new ListFilter(this);
  }

  toUrlParams(): {
    [key: string]: string | null;
  } {
    const idLists = [...this];
    const idListsString = idLists.join(',');

    return {
      idLists: idListsString,
    };
  }

  fromUrlParams({ idLists: idListsString }: { [key: string]: string | null }) {
    const idLists = idListsString?.split(',') || [];

    for (const idList of idLists) {
      this.enable(idList);
    }
  }

  serializeToView() {
    return {
      idLists: [...this],
    };
  }

  deserializeFromView(cardFilterCriteria: CardFilterCriteria) {
    const idLists = cardFilterCriteria.idLists || [];
    for (const idList of idLists) {
      this.enable(idList);
    }
  }
}
