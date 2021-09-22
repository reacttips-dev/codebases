import { Redirect } from '../types';
import { pathToRegexp } from 'path-to-regexp';
import Logger from '@pipedrive/logger-fe';

export const getMatchingRedirect = (redirects: Redirect[], route: string): Redirect | null => {
	return redirects.find(({ from }) => {
		const regex = pathToRegexp(from);

		return regex.exec(route);
	});
};

export const getRedirectedUrl = (firstMatchingRedirect: Redirect, route: string): string => {
	const keys = [];
	const regex = pathToRegexp(firstMatchingRedirect.from, keys);
	const match = regex.exec(route);

	return keys.reduce((currentDestination, { name }, index) => {
		return currentDestination.replace(`{${name}}`, match[index + 1]);
	}, firstMatchingRedirect.to);
};

export const extendWithSearchAndHash = (redirectTo: string, hash: string, search: string): string => {
	const newHash = redirectTo.includes('#') ? '' : hash;
	const newSearch = redirectTo.includes('?') ? '' : search;

	return redirectTo + newSearch + newHash;
};

export const logRedirect = (logger: Logger, from: string, to: string): void => {
	logger.remote(
		'info',
		`Redirecting ${from} to ${to}`,
		{
			from,
			to,
		},
		'froot',
	);
};
