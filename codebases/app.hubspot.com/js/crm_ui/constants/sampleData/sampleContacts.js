'use es6';

import I18n from 'I18n';
import UserStore from 'crm_data/user/UserStore';
var USER_ID = UserStore.get('user_id');
var sampleContactTag = I18n.text('sampleData.sampleContacts.tag');
var sampleContacts = {
  BRIAN: {
    CONTACT_VID: 1,
    // should be unused for tour
    CONTACT_EMAIL: 'bh@hubspot.com',
    // should be unused for tour
    CONTACT_EMAIL_UID: "bh+" + USER_ID + "@hubspot.com",
    CONTACT_PHONE: '888-482-7768',
    CONTACT_FIRST_NAME: 'Brian',
    CONTACT_LAST_NAME: "Halligan " + sampleContactTag,
    CONTACT_JOBTITLE: 'CEO'
  },
  COOL_ROBOT: {
    CONTACT_VID: 1,
    CONTACT_EMAIL: 'coolrobot@hubspot.com',
    CONTACT_EMAIL_UID: "coolrobot+" + USER_ID + "@hubspot.com",
    CONTACT_FIRST_NAME: I18n.text('sampleData.sampleContacts.coolRobot.firstname'),
    CONTACT_LAST_NAME: I18n.text('sampleData.sampleContacts.coolRobot.lastname'),
    CONTACT_JOB_TITLE: I18n.text('sampleData.sampleContacts.coolRobot.jobtitle'),
    CONTACT_PHONE: ''
  },
  STEPH: {
    CONTACT_EMAIL: 'stephanie@glsharchitecture.com'
  },
  MARIA: {
    // Same as Cool Robot, but in practice these will be mutually exclusive contacts
    // as we will be switching from one to the other eventually.
    CONTACT_VID: 1,
    CONTACT_EMAIL: 'emailmaria@hubspot.com',
    CONTACT_EMAIL_UID: "emailmaria+" + USER_ID + "@hubspot.com",
    CONTACT_FIRST_NAME: I18n.text('sampleData.sampleContacts.maria.firstname'),
    CONTACT_LAST_NAME: I18n.text('sampleData.sampleContacts.maria.lastname'),
    CONTACT_JOB_TITLE: I18n.text('sampleData.sampleContacts.maria.jobtitle'),
    CONTACT_PHONE: ''
  }
};
export default sampleContacts;