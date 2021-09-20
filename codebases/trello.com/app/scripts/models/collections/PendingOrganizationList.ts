import CollectionWithHelpers from 'app/scripts/models/collections/internal/collection-with-helpers';
import { PendingOrganization } from 'app/scripts/models/PendingOrganization';

class PendingOrganizationList extends CollectionWithHelpers {
  static initClass() {
    // @ts-expect-error
    this.prototype.model = PendingOrganization;
  }
}
PendingOrganizationList.initClass();

export { PendingOrganizationList };
