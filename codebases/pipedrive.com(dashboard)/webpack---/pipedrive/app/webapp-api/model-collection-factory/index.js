import _ from 'lodash';

export default (componentLoader) => {
	const modelCollectionFactory = {
		setInstance: (instance) => {
			_.assignIn(modelCollectionFactory, instance);
		}
	};

	modelCollectionFactory.initAsync = async () => {
		// Webapp is only available in froot. Otherwise there is an error
		if ('webapp' in componentLoader.components) {
			await componentLoader.load('webapp:main');
		} else {
			throw new Error('webapp is not available in componentLoader');
		}

		return modelCollectionFactory;
	};

	return modelCollectionFactory;
};
