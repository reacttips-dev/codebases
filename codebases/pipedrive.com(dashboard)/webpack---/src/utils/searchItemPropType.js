import PropTypes from 'prop-types';

export default PropTypes.shape({
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	type: PropTypes.string.isRequired,
	name: PropTypes.string,
	title: PropTypes.string,
	value: PropTypes.number,
	currency: PropTypes.string,
	status: PropTypes.string,
	person: PropTypes.shape({
		id: PropTypes.number,
		name: PropTypes.string,
	}),
	organization: PropTypes.shape({
		id: PropTypes.number,
		name: PropTypes.string,
		address: PropTypes.string,
	}),
	address: PropTypes.string,
	emails: PropTypes.array,
	phones: PropTypes.array,
	custom_fields: PropTypes.array,
	notes: PropTypes.array,
}).isRequired;
