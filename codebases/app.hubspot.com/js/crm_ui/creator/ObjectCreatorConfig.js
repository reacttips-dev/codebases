'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _CONTACT$COMPANY$DEAL;

import Promptable from 'UIComponents/decorators/Promptable';
import CompanyRecord from 'customer-data-objects/company/CompanyRecord';
import ContactRecord from 'customer-data-objects/contact/ContactRecord';
import DealRecord from 'customer-data-objects/deal/DealRecord';
import { COMPANY, CONTACT, DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import TicketRecord from 'customer-data-objects/ticket/TicketRecord';
import CompanyCreatorContainerWrapper from '../createDialogs/company/components/CompanyCreatorContainerWrapper';
import ContactCreatorContainer from '../createDialogs/contact/components/ContactCreatorContainer';
import DealCreatorDialogContainer from '../modals/dialogs/deals/DealCreatorDialogContainer';
import TicketCreatorContainer from '../createDialogs/ticket/components/TicketCreatorContainer';
export default (_CONTACT$COMPANY$DEAL = {}, _defineProperty(_CONTACT$COMPANY$DEAL, CONTACT, {
  record: ContactRecord,
  url: 'contact',
  prompt: Promptable(ContactCreatorContainer),
  component: ContactCreatorContainer
}), _defineProperty(_CONTACT$COMPANY$DEAL, COMPANY, {
  record: CompanyRecord,
  url: 'company',
  prompt: Promptable(CompanyCreatorContainerWrapper),
  component: CompanyCreatorContainerWrapper
}), _defineProperty(_CONTACT$COMPANY$DEAL, DEAL, {
  record: DealRecord,
  url: 'deal',
  prompt: Promptable(DealCreatorDialogContainer),
  component: DealCreatorDialogContainer
}), _defineProperty(_CONTACT$COMPANY$DEAL, TICKET, {
  record: TicketRecord,
  url: 'ticket',
  prompt: Promptable(TicketCreatorContainer),
  component: TicketCreatorContainer
}), _CONTACT$COMPANY$DEAL);