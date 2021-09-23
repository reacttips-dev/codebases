'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";

var _Object$assign;

import ProvideReferenceResolvers from 'reference-resolvers/ProvideReferenceResolvers';
import { AUTOMATION_PLATFORM_WORKFLOWS, CONTACT_LIST, CONTACT_STATIC_LIST, FORM, HIERARCHICAL_TEAM, INBOUND_DB_COMPANY_IMPORT, INBOUND_DB_COMPANY_LIST, INBOUND_DB_CONTACT_IMPORT, INBOUND_DB_CONTACT_LIST, INBOUND_DB_DEAL_IMPORT, INBOUND_DB_DEAL_LIST, INBOUND_DB_TICKET_LIST, MULTI_CURRENCY_INFORMATION, SALESFORCE_CAMPAIGN, SEQUENCE, TICKET, USER, WORKFLOW_SALESFORCE, WORKFLOW } from 'reference-resolvers/constants/ReferenceObjectTypes';
import AutomationPlatformWorkflowResolver from 'reference-resolvers/resolvers/AutomationPlatformWorkflowReferenceResolver';
import ContactListReferenceResolver from 'reference-resolvers/resolvers/ContactListReferenceResolver';
import ContactStaticListReferenceResolver from 'reference-resolvers/resolvers/ContactStaticListReferenceResolver';
import HierarchicalTeamReferenceResolver from 'reference-resolvers/resolvers/HierarchicalTeamReferenceResolver';
import InboundDbCompanyImportReferenceResolver from 'reference-resolvers/resolvers/InboundDbCompanyImportReferenceResolver';
import InboundDbCompanyListReferenceResolver from 'reference-resolvers/resolvers/InboundDbCompanyListReferenceResolver';
import InboundDbContactImportReferenceResolver from 'reference-resolvers/resolvers/InboundDbContactImportReferenceResolver';
import InboundDbContactListReferenceResolver from 'reference-resolvers/resolvers/InboundDbContactListReferenceResolver';
import InboundDbDealImportReferenceResolver from 'reference-resolvers/resolvers/InboundDbDealImportReferenceResolver';
import InboundDbDealListReferenceResolver from 'reference-resolvers/resolvers/InboundDbDealListReferenceResolver';
import InboundDbTicketListReferenceResolver from 'reference-resolvers/resolvers/InboundDbTicketListReferenceResolver';
import MultiCurrencyInformationResolver from 'reference-resolvers/resolvers/MultiCurrencyInformationResolver';
import SalesforceCampaignReferenceResolver from 'reference-resolvers/resolvers/SalesforceCampaignReferenceResolver';
import SalesforceWorkflowReferenceResolver from 'reference-resolvers/resolvers/SalesforceWorkflowReferenceResolver';
import SequencesReferenceResolver from 'reference-resolvers/resolvers/SequencesReferenceResolver';
import UserReferenceResolver from 'reference-resolvers/resolvers/UserReferenceResolver';
import WorkflowReferenceResolver from 'reference-resolvers/resolvers/WorkflowReferenceResolver';
import { getPropertyInputResolverCreators } from 'customer-data-properties/resolvers/PropertyInputResolvers';
import UIFlex from 'UIComponents/layout/UIFlex';
import TicketReferenceResolver from 'reference-resolvers/resolvers/TicketReferenceResolver';
import FormBatchedReferenceResolver from 'reference-resolvers/resolvers/FormBatchedReferenceResolver';
import { Router, Switch, Route } from 'react-router-dom';
import ObjectCreatorRoute from './routes/ObjectCreatorRoute';
import ObjectAssociatorRoute from './routes/ObjectAssociatorRoute';
import CreateObjectEmbeddedRoute from './object-create/CreateObjectEmbeddedRoute';
import { history } from './router/history';

function AppContainer() {
  return /*#__PURE__*/_jsx(UIFlex, {
    direction: "column",
    align: "stretch",
    children: /*#__PURE__*/_jsx(Router, {
      history: history,
      children: /*#__PURE__*/_jsxs(Switch, {
        children: [/*#__PURE__*/_jsx(Route, {
          path: "/object/create/perf",
          exact: true,
          children: /*#__PURE__*/_jsx(CreateObjectEmbeddedRoute, {})
        }), /*#__PURE__*/_jsx(Route, {
          path: "/object/create",
          exact: true,
          children: /*#__PURE__*/_jsx(ObjectCreatorRoute, {})
        }), /*#__PURE__*/_jsx(Route, {
          path: "/object/associate",
          exact: true,
          children: /*#__PURE__*/_jsx(ObjectAssociatorRoute, {})
        })]
      })
    })
  });
}

var resolvers = Object.assign((_Object$assign = {}, _defineProperty(_Object$assign, AUTOMATION_PLATFORM_WORKFLOWS, AutomationPlatformWorkflowResolver), _defineProperty(_Object$assign, CONTACT_LIST, ContactListReferenceResolver), _defineProperty(_Object$assign, CONTACT_STATIC_LIST, ContactStaticListReferenceResolver), _defineProperty(_Object$assign, FORM, FormBatchedReferenceResolver), _defineProperty(_Object$assign, HIERARCHICAL_TEAM, HierarchicalTeamReferenceResolver), _defineProperty(_Object$assign, INBOUND_DB_COMPANY_IMPORT, InboundDbCompanyImportReferenceResolver), _defineProperty(_Object$assign, INBOUND_DB_CONTACT_IMPORT, InboundDbContactImportReferenceResolver), _defineProperty(_Object$assign, INBOUND_DB_DEAL_IMPORT, InboundDbDealImportReferenceResolver), _defineProperty(_Object$assign, INBOUND_DB_COMPANY_LIST, InboundDbCompanyListReferenceResolver), _defineProperty(_Object$assign, INBOUND_DB_CONTACT_LIST, InboundDbContactListReferenceResolver), _defineProperty(_Object$assign, INBOUND_DB_DEAL_LIST, InboundDbDealListReferenceResolver), _defineProperty(_Object$assign, INBOUND_DB_TICKET_LIST, InboundDbTicketListReferenceResolver), _defineProperty(_Object$assign, MULTI_CURRENCY_INFORMATION, MultiCurrencyInformationResolver), _defineProperty(_Object$assign, SALESFORCE_CAMPAIGN, SalesforceCampaignReferenceResolver), _defineProperty(_Object$assign, SEQUENCE, SequencesReferenceResolver), _defineProperty(_Object$assign, TICKET, TicketReferenceResolver), _defineProperty(_Object$assign, USER, UserReferenceResolver), _defineProperty(_Object$assign, WORKFLOW, WorkflowReferenceResolver), _defineProperty(_Object$assign, WORKFLOW_SALESFORCE, SalesforceWorkflowReferenceResolver), _Object$assign), getPropertyInputResolverCreators());
export default ProvideReferenceResolvers(resolvers)(AppContainer);