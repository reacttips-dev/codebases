import { Record } from 'immutable';
var Responder = Record({
  agentState: null,
  agentType: null,
  avatar: null,
  bot: false,
  email: null,
  firstName: null,
  lastName: null,
  meetingsLinkUrl: null,
  meetingsLinkText: null,
  online: false,
  salesPro: false,
  userId: null,
  assignable: true
}, 'Responder');
export default Responder;