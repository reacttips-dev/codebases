import { Invitation } from 'app/scripts/models/invitation';

class OrganizationInvitation extends Invitation {
  static initClass() {
    this.prototype.typeName = 'OrganizationInvitation';
  }
}
OrganizationInvitation.initClass();

export { OrganizationInvitation };
