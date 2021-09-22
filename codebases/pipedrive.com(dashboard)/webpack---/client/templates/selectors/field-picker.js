export const getFilteredFields = (store) => {
	const { fields, fieldsSearchInputText, hideDealFields, configMode } = store;

	return fields.filter((field) => {
		if (hideDealFields && field.type === 'deal' && !configMode) {
			return false;
		}

		return field.title.toLowerCase().includes(fieldsSearchInputText.toLowerCase());
	});
};
