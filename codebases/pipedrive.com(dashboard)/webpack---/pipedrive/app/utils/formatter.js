/**
 * formatterInstance is set lazily from componentLoader's shared instance of Formatter class
 * we use a Proxy object to enable binding the correct instance (this) value to the target methods
 */
let formatterInstance = null;

const handler = {
	get: (_target, key) => {
		if (key === 'setFormatter') {
			return (instance) => {
				formatterInstance = instance;
				window.format = (...args) => {
					if (process.env.NODE_ENV !== 'production') {
						// eslint-disable-next-line no-console
						console.warn(
							'Deprecation warning: Use shared component `froot:formatter` instead of window.format()'
						);
					}

					return formatterInstance.format(...args);
				};
			};
		}

		return (...args) => {
			return formatterInstance[key]?.apply(formatterInstance, args);
		};
	}
};

module.exports = new Proxy({}, handler);
