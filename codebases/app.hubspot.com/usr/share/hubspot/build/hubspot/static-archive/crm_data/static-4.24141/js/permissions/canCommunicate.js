'use es6';

import { Iterable, Set as ImmutableSet } from 'immutable';
/*
    Please cc @HubSpot/mobile-crm in PRs that change this file.
*/

export default function () {
  var ownerIds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ImmutableSet();
  var teamIds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ImmutableSet();
  var scopes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var currentOwner = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  var currentTeams = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
  var hubspotOwnerId = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';

  // todo - remove backward compatibility of non-iterable ownerIds
  // https://git.hubteam.com/HubSpot/LiveMessagesUI/blob/78101ec4f7fca25a68b766b0519ef5c96c210836/MessagesApp/static/js/crm-integration/selectors/getCanViewCurrentContact.js#L10
  if (!Iterable.isIterable(ownerIds) && hubspotOwnerId === '') {
    hubspotOwnerId = ownerIds;
  }

  var allOwnerIds = Iterable.isIterable(ownerIds) && ownerIds || ImmutableSet.of(ownerIds);
  var isOwner = allOwnerIds.includes("" + currentOwner); // I can communicate with everyone

  if (scopes['contacts-communicates-all']) {
    return true;
  } // I can communicate with contacts I own


  if (scopes['contacts-communicates-owned'] && isOwner) {
    return true;
  } // I can communicate with unknown visitors AND contacts with no owners
  // note: `unknown` applies to conversations and not CRM specifically


  if (scopes['communicates-unassigned-or-unknown'] && !hubspotOwnerId) {
    return true;
  } // I can communicate with contacts my team owns.


  if (teamIds.size && scopes['contacts-communicates-team']) {
    return Boolean(teamIds.intersect(currentTeams.map(function (id) {
      return "" + id;
    })).size);
  }

  return false;
}