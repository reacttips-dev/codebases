import TrelloModel, {
  TrelloModelAttributes,
} from 'app/scripts/models/internal/trello-model';

interface PendingOrganizationAttributes extends TrelloModelAttributes {}

class PendingOrganization extends TrelloModel<PendingOrganizationAttributes> {
  static initClass() {
    this.prototype.typeName = 'PendingOrganization';
  }
}
PendingOrganization.initClass();

export { PendingOrganization };
