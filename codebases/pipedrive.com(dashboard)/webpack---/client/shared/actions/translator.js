export const SET_TRANSLATOR = 'SET_TRANSLATOR';

export const setTranslator = (translator) => (dispatch) => {
	dispatch({
		type: SET_TRANSLATOR,
		translator
	});
};
