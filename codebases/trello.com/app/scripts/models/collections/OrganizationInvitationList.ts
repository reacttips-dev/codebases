import { InvitationList } from 'app/scripts/models/collections/invitation-list';
import { OrganizationInvitation } from 'app/scripts/models/OrganizationInvitation';

class OrganizationInvitationList extends InvitationList {
  public model: typeof OrganizationInvitation;

  static initClass() {
    this.prototype.model = OrganizationInvitation;
  }
}
OrganizationInvitationList.initClass();

export { OrganizationInvitationList };
