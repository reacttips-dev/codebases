import React from 'react';

const defaultValue = {
	componentLoader: null,
	MicroFEComponent: null,
	translator: null,
	metrics: null,
	user: null,
};

export const ApiContext = React.createContext(defaultValue);
