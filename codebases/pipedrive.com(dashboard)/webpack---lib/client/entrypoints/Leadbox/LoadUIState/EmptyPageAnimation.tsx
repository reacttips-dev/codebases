import React from 'react';
import Lottie from 'react-lottie';

import emptyPageAnimationData from './assets/emptyPageAnimation.json';

export const EmptyPageAnimation = () => (
	<Lottie
		options={{
			autoplay: true,
			loop: false,
			animationData: emptyPageAnimationData,
		}}
		width={480}
		height={240}
	/>
);
