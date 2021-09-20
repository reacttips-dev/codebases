import TrelloModel, {
  TrelloModelAttributes,
} from 'app/scripts/models/internal/trello-model';

interface NotificationGroupAttributes extends TrelloModelAttributes {}

class NotificationGroup extends TrelloModel<NotificationGroupAttributes> {
  urlRoot: string;
  static initClass() {
    this.prototype.typeName = 'NotificationGroup';
    this.prototype.urlRoot = '/1/notificationGroups';
  }
}
NotificationGroup.initClass();

export { NotificationGroup };
