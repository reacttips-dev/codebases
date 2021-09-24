'use es6';

import get from 'transmute/get';
import { CONTACT, COMPANY, DEAL } from 'customer-data-objects/constants/ObjectTypes';
import * as ImmutableModel from 'customer-data-objects/model/ImmutableModel';
export function betDealCreationRestricted(scopes) {
  return get('bet-create-deals-by-top-bar-restriction', scopes) === true;
}
export function isBetPortal(scopes) {
  return betDealCreationRestricted(scopes);
}
export function betHasCustomDealForm(scopes) {
  return get('bet-custom-deal-form', scopes) === true;
}
export function isDomainUnbanished(object, property) {
  var domainProperty = ImmutableModel.getProperty(object, property);
  return !domainProperty || domainProperty !== 'banished_domain';
}
export function isDomainValid(company, contact) {
  var companyDomainUnbanished = isDomainUnbanished(company, 'cleaned_domain');
  var contactDomainUnbanished = isDomainUnbanished(contact, 'company_info_domain');

  if (company) {
    if (contact) {
      return companyDomainUnbanished && contactDomainUnbanished;
    }

    return companyDomainUnbanished;
  }

  if (contact) {
    return contactDomainUnbanished;
  }

  return true;
}
export function hasAssociatedCompany(associatedCompany, scopes) {
  if (betDealCreationRestricted(scopes)) {
    return associatedCompany;
  }

  return true;
}
export function canBETCreate(scopes, objectType, company, contactOwner, subject) {
  if (objectType === CONTACT) {
    return get('bet-cold-source-restriction', scopes) !== true;
  }

  if (objectType === COMPANY) {
    return get('bet-create-companies-restriction', scopes) !== true || get('bet-companies-create', scopes) === true;
  }

  if (objectType === DEAL) {
    if (!isDomainValid(company, subject)) {
      return false;
    }

    if (!hasAssociatedCompany(company, scopes)) {
      return false;
    }
  }

  return true;
}
export function betShouldHideDealQuotesCard(scopes) {
  return get('bet-hide-quotes-card', scopes) === true;
}
export function canBETModifyAssociation(scopes, objectType, cardType) {
  if (!isBetPortal(scopes)) {
    return true;
  }

  if (cardType !== DEAL || objectType !== COMPANY) {
    return true;
  }

  return get('bet-change-associated-company', scopes) === true;
}