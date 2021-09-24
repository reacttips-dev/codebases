import { List, Record } from 'immutable';
var Recipient = Record({
  actorId: '',
  deliveryIdentifier: List(),
  recipientField: null
}, 'Recipient');
export default Recipient;