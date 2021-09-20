import { Invitation } from 'app/scripts/models/invitation';

class BoardInvitation extends Invitation {
  static initClass() {
    this.prototype.typeName = 'BoardInvitation';
  }
}
BoardInvitation.initClass();

export { BoardInvitation };
