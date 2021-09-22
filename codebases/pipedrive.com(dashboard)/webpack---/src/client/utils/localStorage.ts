import Logger from '@pipedrive/logger-fe';

const logger = new Logger('froot', 'localStorage');

/* To be used only when value is always stringified when setting the value (with `set`) */
export function get(key: string) {
	try {
		const item = localStorage.getItem(key);

		return JSON.parse(item);
	} catch (error) {
		logger.log('Could not get data item local storage', error);
	}
}

export function set(key: string, value: any) {
	try {
		return localStorage.setItem(key, JSON.stringify(value));
	} catch (error) {
		logger.log('Could not set item to local storage', error);
	}
}

export function remove(key: string) {
	try {
		return localStorage.removeItem(key);
	} catch (error) {
		logger.log('Could not remove item from local storage', error);
	}
}
