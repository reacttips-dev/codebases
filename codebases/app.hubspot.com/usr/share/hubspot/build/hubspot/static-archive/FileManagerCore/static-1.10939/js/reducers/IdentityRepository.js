'use es6';

import Immutable from 'immutable';
import { UserInferredRoles } from '../Constants';
import { INFERRED_USER_ROLE_FETCH_SUCCEEDED } from '../actions/ActionTypes';
var IdentityRepositoryDefaultState = Immutable.Map({
  inferredUserRole: UserInferredRoles.get('HEAVY_MARKETER')
});
export default function identityRepository() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : IdentityRepositoryDefaultState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type,
      inferredUserRole = action.inferredUserRole;

  switch (type) {
    case INFERRED_USER_ROLE_FETCH_SUCCEEDED:
      return state.merge({
        inferredUserRole: inferredUserRole
      });

    default:
      return state;
  }
}