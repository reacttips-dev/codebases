const isIntercomReady = () => {
	return !!(window as any).Intercom;
};

const showIntercom = () => {
	isIntercomReady() && (window as any).Intercom('show');
};

export { isIntercomReady, showIntercom };
