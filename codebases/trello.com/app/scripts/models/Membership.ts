import TrelloModel, {
  TrelloModelAttributes,
} from 'app/scripts/models/internal/trello-model';

interface MembershipAttributes extends TrelloModelAttributes {}

export class Membership extends TrelloModel<MembershipAttributes> {}
