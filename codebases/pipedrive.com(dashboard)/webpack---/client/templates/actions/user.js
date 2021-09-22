export const SET_USER_EMAIL = 'SET_USER_EMAIL';

export const setUserEmails = (userEmail) => (dispatch) => {
	dispatch({
		type: SET_USER_EMAIL,
		email: userEmail
	});
};
