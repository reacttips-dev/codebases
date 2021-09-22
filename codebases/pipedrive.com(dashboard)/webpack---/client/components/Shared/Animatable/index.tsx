import React from 'react';
import { useSpring, animated } from '@react-spring/web';

type Props = {
	visible: boolean;
};

const Animatable: React.FunctionComponent<Props> = ({ visible, children }) => {
	const springProps = useSpring({
		bottom: visible ? 0 : -65,
		opacity: visible ? 1 : 0,
		width: '100%',
		position: 'absolute',
		// z-index should be higher than the header to make sure deal actions are on top of sales assistent
		zIndex: 2001,
	});

	return (
		// @ts-expect-error Known type definition error in `react-spring` library.
		// Workaround would be to use `position: springProps.position as any`
		// https://github.com/pmndrs/react-spring/issues/1645
		<animated.div style={springProps}>{children}</animated.div>
	);
};

export default Animatable;
