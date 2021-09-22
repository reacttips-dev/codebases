let instance;

const componentLoader = {
	setComponentLoader: (i) => {
		instance = i;
	},
	load: (...args) => {
		return instance.load(...args);
	},
	get components() {
		return instance.components;
	},
	register: (...args) => {
		return instance.register(...args);
	}
};

module.exports = componentLoader;
