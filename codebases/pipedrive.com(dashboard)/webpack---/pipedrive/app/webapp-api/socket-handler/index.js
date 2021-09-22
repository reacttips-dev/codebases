import SocketHandlerModel from './model';
const User = require('models/user');
const Users = require('collections/company');
const Formatter = require('utils/formatter');

export default async (componentLoader) => {
	const [user, users, socket, modelCollectionFactory, formatter] = await Promise.all([
		componentLoader.load('webapp:user'),
		componentLoader.load('webapp:users'),
		componentLoader.load('webapp:socket'),
		componentLoader.load('webapp:model-collection-factory'),
		componentLoader.load('froot:formatter')
	]);

	User.setUser(user);
	Users.setUsers(users);
	Formatter.setFormatter(formatter);

	const socketHandler = new SocketHandlerModel(null, {
		socket,
		user,
		modelCollectionFactory
	});

	return socketHandler;
};
