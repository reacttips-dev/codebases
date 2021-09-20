import { BoardBackground } from 'app/scripts/models/BoardBackground';
import CollectionWithHelpers from 'app/scripts/models/collections/internal/collection-with-helpers';

class BoardBackgroundList extends CollectionWithHelpers {
  static initClass() {
    // @ts-expect-error
    this.prototype.model = BoardBackground;
  }
  url() {
    // @ts-expect-error
    return `/1/member/${this.member.id}/boardBackgrounds`;
  }

  // @ts-expect-error
  initialize(list, { member }) {
    // @ts-expect-error
    this.member = member;
  }
}
BoardBackgroundList.initClass();

export { BoardBackgroundList };
