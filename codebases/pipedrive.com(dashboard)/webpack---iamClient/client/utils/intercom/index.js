export const isReady = () => {
	return !!window.Intercom;
};

export const show = () => {
	isReady() && window.Intercom('show');
};

export default {
	isReady,
	show,
};