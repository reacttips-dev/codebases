import React from 'react';

export const ConditionalWrapper: React.FC<{
	children: React.ReactElement;
	condition?: boolean;
	wrapper(children: React.ReactElement): React.ReactElement;
}> = ({ condition, wrapper, children }) => (condition ? wrapper(children) : children);
