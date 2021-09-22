import logger from 'utils/logger';
import { forOwn } from 'lodash';

export default () => next => action => {
	if (action.meta && action.meta.logger) {
		forOwn(action.meta.logger, (value, key) => {
			if (typeof logger[key] !== 'function') {
				return;
			}

			if (!Array.isArray(value)) {
				value = [value];
			}

			if (key === 'remote') {
				logger.remote('info', ...value);
			} else {
				logger[key](...value);
			}
		});
	}

	next(action);
};
