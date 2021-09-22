import setup from '../utils';
import * as iamClient from 'bundles/all';

async function getData(componentLoader) {
	return await Promise.all([
		iamClient,
		componentLoader.load('webapp:user'),
		componentLoader.load('webapp:metrics'),
		componentLoader.load('froot:router'),
	]);
}

export default setup(getData);
