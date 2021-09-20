import { BoardInvitation } from 'app/scripts/models/BoardInvitation';
import { InvitationList } from 'app/scripts/models/collections/invitation-list';

class BoardInvitationList extends InvitationList {
  public model: typeof BoardInvitation;

  static initClass() {
    this.prototype.model = BoardInvitation;
  }
}
BoardInvitationList.initClass();

export { BoardInvitationList };
