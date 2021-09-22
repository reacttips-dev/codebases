import React from 'react';

interface UserDataContext {
	menuWaitressUser: any;
	user: any;
	users: any;
	teams: any;
	signupData: any;
	configuration: any;
	mailConnections: any;
}

const UserDataContext = React.createContext<UserDataContext>({
	menuWaitressUser: null,
	user: null,
	users: null,
	teams: null,
	signupData: null,
	mailConnections: null,
	configuration: null,
});

export default UserDataContext;
