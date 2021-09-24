import { List, Map as ImmutableMap } from 'immutable';
import makeObjectRecord from '../record/makeObjectRecord';
import { CONTACT } from '../constants/ObjectTypes';
import ObjectIds from '../constants/ObjectIds';
import { getProperty } from '../model/ImmutableModel';
import formatName from 'I18n/utils/formatName';
var ContactRecord = makeObjectRecord({
  idKey: ObjectIds[CONTACT],
  objectType: CONTACT,
  recordName: 'ContactRecord',
  defaults: {
    'associated-company': undefined,
    'canonical-vid': null,
    deleted: false,
    'form-submissions': List(),
    'identity-profiles': List(),
    'is-contact': true,
    'list-memberships': List(),
    'merge-audits': List(),
    'merged-vids': List(),
    'portal-id': null,
    'profile-token': null,
    'profile-url': null,
    properties: ImmutableMap(),
    vid: null
  }
}, {
  primary: function primary(record) {
    var firstName = getProperty(record, 'firstname');
    var lastName = getProperty(record, 'lastname');
    return formatName({
      firstName: firstName,
      lastName: lastName
    });
  },
  secondary: ['email']
});
export default ContactRecord;