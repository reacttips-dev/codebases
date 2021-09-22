import Socket from './model';

export default async (componentLoader) => {
	const user = await componentLoader.load('webapp:user');

	const socket = new Socket(null, { user });

	socket.open();

	window.addEventListener('beforeunload', () => socket.close());

	return socket;
};
