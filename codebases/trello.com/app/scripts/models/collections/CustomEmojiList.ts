import CollectionWithHelpers from 'app/scripts/models/collections/internal/collection-with-helpers';
import { CustomEmoji } from 'app/scripts/models/CustomEmoji';

class CustomEmojiList extends CollectionWithHelpers {
  static initClass() {
    // @ts-expect-error
    this.prototype.model = CustomEmoji;
  }
  url() {
    // @ts-expect-error
    return `/1/member/${this.member.id}/customEmoji`;
  }

  // @ts-expect-error
  initialize(list, { member }) {
    // @ts-expect-error
    this.member = member;
  }
}
CustomEmojiList.initClass();

export { CustomEmojiList };
