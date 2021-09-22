// globals document
export default {
	get: (name) => {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);

		if (parts.length === 2) {
			return parts.pop().split(';').shift();
		} else {
			return '';
		}
	},
};
