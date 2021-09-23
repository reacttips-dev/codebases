'use es6';

import { CONTACT, COMPANY, DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import PropTypes from 'prop-types'; // ProfileObjectTypesType are ObjectTypes that also have a record (Subject) and
// associated profile page.
// Please do not add other ObjectTypes that do not have a profile to this list.

export default PropTypes.oneOf([CONTACT, COMPANY, DEAL, TICKET]);