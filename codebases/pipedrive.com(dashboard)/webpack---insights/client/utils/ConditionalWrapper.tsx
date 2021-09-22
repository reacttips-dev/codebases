import React from 'react';

interface ConditionalWrapperProps {
	condition?: boolean;
	wrapper: (children: JSX.Element) => JSX.Element;
	children: JSX.Element;
}

const ConditionalWrapper: React.FC<ConditionalWrapperProps> = ({
	condition,
	wrapper,
	children,
}) => (condition ? React.cloneElement(wrapper(children)) : children);

export default ConditionalWrapper;
