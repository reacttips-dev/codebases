'use es6';

import { fromJS } from 'immutable';
import * as colors from 'HubStyleTokens/colors';
export var EntityTypes = {
  MERGE_TAG: 'mergeTag'
};
export var MergeTagTypes = {
  CONTACT: 'contact',
  COMPANY: 'company',
  DEAL: 'deal',
  TICKET: 'ticket',
  QUOTE: 'quote',
  SENDER: 'sender',
  PLACEHOLDER: 'placeholder'
};
export var MergeTagPropertyTypes = {
  CONTACT: 'contactProperties',
  COMPANY: 'companyProperties',
  DEAL: 'dealProperties',
  TICKET: 'ticketProperties',
  QUOTE: 'quoteProperties',
  SENDER: 'senderProperties',
  PLACEHOLDER: 'placeholderProperties'
};
export var MergeTagI18n = {
  CONTACT: 'draftPlugins.mergeTagGroupPlugin.mergeTags.contact',
  COMPANY: 'draftPlugins.mergeTagGroupPlugin.mergeTags.company',
  DEAL: 'draftPlugins.mergeTagGroupPlugin.mergeTags.deal',
  TICKET: 'draftPlugins.mergeTagGroupPlugin.mergeTags.ticket',
  QUOTE: 'draftPlugins.mergeTagGroupPlugin.mergeTags.quote',
  SENDER: 'draftPlugins.mergeTagGroupPlugin.mergeTags.sender',
  PLACEHOLDER: 'draftPlugins.mergeTagGroupPlugin.mergeTags.placeholder'
};
export var MergeTagDefaultOptions = fromJS({
  contact: {
    prefix: MergeTagTypes.CONTACT,
    objectType: MergeTagPropertyTypes.CONTACT,
    color: colors.LORAX,
    backgroundColor: colors.LORAX_LIGHT
  },
  company: {
    prefix: MergeTagTypes.COMPANY,
    objectType: MergeTagPropertyTypes.COMPANY,
    color: colors.CALYPSO,
    backgroundColor: colors.CALYPSO_LIGHT
  },
  deal: {
    prefix: MergeTagTypes.DEAL,
    objectType: MergeTagPropertyTypes.DEAL,
    color: colors.THUNDERDOME,
    backgroundColor: colors.THUNDERDOME_LIGHT
  },
  ticket: {
    prefix: MergeTagTypes.TICKET,
    objectType: MergeTagPropertyTypes.TICKET,
    color: colors.MARIGOLD,
    backgroundColor: colors.MARIGOLD_LIGHT
  },
  quote: {
    prefix: MergeTagTypes.QUOTE,
    objectType: MergeTagPropertyTypes.QUOTE,
    color: colors.NORMAN,
    backgroundColor: colors.NORMAN_LIGHT
  },
  sender: {
    prefix: MergeTagTypes.SENDER,
    objectType: MergeTagPropertyTypes.SENDER,
    color: colors.OZ,
    backgroundColor: colors.OZ_LIGHT
  },
  placeholder: {
    prefix: MergeTagTypes.PLACEHOLDER,
    objectType: MergeTagPropertyTypes.PLACEHOLDER,
    color: colors.CANDY_APPLE,
    backgroundColor: colors.CANDY_APPLE_LIGHT
  }
});