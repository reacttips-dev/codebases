import Immutable, { fromJS } from 'immutable';

export const initialState = fromJS({
	activityTypes: new Immutable.List(),
	activitySubjectPlaceholder: '',
});

const getSelectedActivityType = (types, selectedType) => {
	return types.find((type) => type.get('key_string') === selectedType);
};

export default (state = initialState, action = { type: 'INIT' }) => {
	switch (action.type) {
		case 'ACTIVITY_FORM_ACTIVITY_TYPES':
			return state.set('activityTypes', fromJS(action.activityTypes));
		case 'ACTIVITY_FORM_DEFAULT_ACTIVITY_TYPE':
			return state.set('activitySubjectPlaceholder', action.defaultActivityType.name || '');
		case 'FIELD_UPDATE': {
			if (action.field !== 'type') {
				return state;
			}

			const selectedType = getSelectedActivityType(state.get('activityTypes'), action.value);

			if (!selectedType) {
				return state;
			}

			return state.set('activitySubjectPlaceholder', selectedType.get('name'));
		}
		case 'UPDATE_MULTIPLE_FIELDS': {
			if (!Object.keys(action.fields).includes('type')) {
				return state;
			}

			const selectedType = getSelectedActivityType(
				state.get('activityTypes'),
				action.fields.type,
			);

			if (!selectedType) {
				return state;
			}

			return state.set('activitySubjectPlaceholder', selectedType.get('name'));
		}
		default:
			return state;
	}
};
