let instance;

const googleFiles = {
	setGoogleFiles: (i) => {
		instance = i;
	},
	browseFiles: (...args) => instance.browseFiles(...args),
	openFile: (...args) => instance.openFile(...args),
	prepareAPI: (...args) => instance.prepareAPI(...args),
	on: (...args) => instance.on(...args),
	login: (...args) => instance.login(...args),
	get ready() {
		return instance.ready;
	},
	get loginInProcess() {
		return instance.loginInProcess;
	},
	get needsLogin() {
		return instance.needsLogin;
	}
};

module.exports = googleFiles;
