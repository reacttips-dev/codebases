import { actionTypes } from '../constants/action-types';

const userSelf = (state = {}, action) => {
	if (action.type === actionTypes.SET_USER_SELF) {
		return action.userSelf;
	}

	return state;
};

export default userSelf;
