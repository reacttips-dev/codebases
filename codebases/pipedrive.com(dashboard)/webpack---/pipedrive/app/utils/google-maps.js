let instance;

const googleMaps = {
	setGoogleMaps: (i) => {
		instance = i;
	},
	ready: (...args) => instance.ready(...args)
};

module.exports = googleMaps;
