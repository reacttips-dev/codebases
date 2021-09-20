import { FilterableCard } from 'app/src/components/ViewFilters/types';
import { ID_NONE } from 'app/common/lib/util/satisfies-filter';
import {
  BoardTableViewFilter,
  CardFilterCriteria,
} from './BoardTableViewFilter';

const VALID_ID_REGEX = /^[a-f0-9]{24}$/;

const isValidObjectID = (s: string | null) =>
  typeof s === 'string' && VALID_ID_REGEX.test(s);

export class MembersFilter extends Set<string> implements BoardTableViewFilter {
  filterLength(): number {
    return this.size;
  }

  isEmpty(): boolean {
    return this.filterLength() === 0;
  }

  isEnabled(memberId: string) {
    return this.has(memberId);
  }

  disable(memberId: string) {
    this.delete(memberId);
  }

  enable(memberId: string) {
    this.add(memberId);
  }

  toggle(memberId: string) {
    if (this.isEnabled(memberId)) {
      this.disable(memberId);
    } else {
      this.enable(memberId);
    }

    // Returns a new instance so that we can use it for `setState`.
    const newMembersFilter = new MembersFilter(this);
    return newMembersFilter;
  }

  satisfiesMembersFilter(
    cardMembers: FilterableCard['idMembers'],
    isAnd?: boolean,
  ): boolean {
    if (this.isEmpty()) {
      return true;
    }

    const showCardsWithNoMembers = this.isEnabled(ID_NONE);
    const showCardsWithAnyone = this.isEnabled('anyone');

    if (isAnd) {
      if (showCardsWithNoMembers && this.filterLength() > 1) {
        return false;
      }

      if (showCardsWithNoMembers && cardMembers.length === 0) {
        return true;
      }

      const filterMembers = Array.from(this);
      return filterMembers.every((idMember) => cardMembers.includes(idMember));
    } else {
      if (showCardsWithNoMembers && cardMembers.length === 0) {
        return true;
      }

      if (showCardsWithAnyone && cardMembers.length > 0) {
        return true;
      }

      return cardMembers.some((idMember) => this.isEnabled(idMember));
    }
  }

  toUrlParams(): {
    idMembers: string | null;
  } {
    const idMembersString = [...this].join(',');
    return { idMembers: idMembersString || null };
  }

  fromUrlParams({
    idMembers: idMembersString,
  }: {
    [key: string]: string | null;
  }) {
    const idMembers =
      idMembersString
        ?.split(',')
        .filter((member) =>
          member === ID_NONE ? true : isValidObjectID(member),
        ) ?? [];
    idMembers.forEach((idMember) => this.enable(idMember));
  }

  serializeToView() {
    return {
      idMembers: [...this],
    };
  }

  deserializeFromView(cardFilterCriteria: CardFilterCriteria) {
    const idMembers = cardFilterCriteria.idMembers || [];
    for (const idMember of idMembers) {
      this.enable(idMember);
    }
  }
}
