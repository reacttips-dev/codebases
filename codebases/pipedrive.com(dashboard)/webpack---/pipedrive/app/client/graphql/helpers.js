import _ from 'lodash';

export function keyBy(collection, keyKey, valueKey) {
	return collection.reduce((acc, cur) => {
		acc[cur[keyKey]] = cur[valueKey];

		return acc;
	}, {});
}

export function removeNulls(obj) {
	if (!obj) {
		return;
	}

	function prune(current) {
		const currentIsArray = Array.isArray(current);

		// eslint-disable-next-line no-unused-vars
		for (const key of Object.keys(current)) {
			const value = current[key];

			if (value === null) {
				if (!currentIsArray) {
					delete current[key];
				}
			} else if (typeof value === 'object') {
				prune(value);
			}
		}

		return current;
	}

	return prune(_.cloneDeep(obj));
}
