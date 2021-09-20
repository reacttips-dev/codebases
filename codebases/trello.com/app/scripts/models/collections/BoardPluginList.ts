import CollectionWithHelpers from 'app/scripts/models/collections/internal/collection-with-helpers';
import { BoardPlugin } from 'app/scripts/models/BoardPlugin';

class BoardPluginList extends CollectionWithHelpers {
  static initClass() {
    // @ts-expect-error
    this.prototype.model = BoardPlugin;
  }

  // @ts-expect-error
  initialize(list, { board }) {
    // @ts-expect-error
    return (this.board = board);
  }

  url() {
    // @ts-expect-error
    return `/1/boards/${this.board.id}/boardPlugins`;
  }
}
BoardPluginList.initClass();

export { BoardPluginList };
