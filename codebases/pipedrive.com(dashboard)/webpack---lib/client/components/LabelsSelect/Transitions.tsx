import React, { createContext, useContext, useEffect, useRef, Ref } from 'react';

import { CSS_TRANSITION_CLASS_LEFT, SlideLeftTransition } from './Transition.left.styles';
import { CSS_TRANSITION_CLASS_RIGHT, SlideRightTransition } from './Transition.right.styles';
import * as S from './Transition.styles';

export const TransitionContext = createContext<{
	inner: Ref<HTMLDivElement>;
}>({
	inner: null,
});

export const TransitionHolder: React.FC<{
	changeOn: Array<string | boolean>;
	timeout?: number;
}> = ({ children, changeOn }) => {
	const holder = useRef<HTMLDivElement | null>(null);
	const inner = useRef<HTMLDivElement | null>(null);
	const { Provider } = TransitionContext;

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		holder.current!.style.height = `${inner.current!.offsetHeight}px`;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [...changeOn]);

	return (
		<Provider value={{ inner }}>
			<S.Holder ref={holder}>{children}</S.Holder>
		</Provider>
	);
};

export const Transition: React.FC<{
	display: boolean;
	direction: 'left' | 'right';
}> = ({ children, display, direction }) => {
	const { inner } = useContext(TransitionContext);

	const TransitionComponent = direction === 'left' ? SlideLeftTransition : SlideRightTransition;
	const classNames = direction === 'left' ? CSS_TRANSITION_CLASS_LEFT : CSS_TRANSITION_CLASS_RIGHT;

	return (
		<TransitionComponent classNames={classNames} in={display} timeout={350} unmountOnExit>
			<S.Item ref={display ? inner : null}>{children}</S.Item>
		</TransitionComponent>
	);
};

export const TransitionFromRight: React.FC<{ display: boolean }> = (props) => (
	<Transition {...props} direction="right" />
);
export const TransitionFromLeft: React.FC<{ display: boolean }> = (props) => <Transition {...props} direction="left" />;
