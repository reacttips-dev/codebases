import React from 'react';
import { forEach } from 'lodash';

export const getZIndex = (e) => {
	if (!(e instanceof Element)) {
		return 0;
	}

	const z = document.defaultView.getComputedStyle(e).getPropertyValue('z-index') || e.style.zIndex;

	const parsedZ = parseInt(z, 10);

	if (isNaN(parsedZ) && e.parentNode) {
		return getZIndex(e.parentNode);
	} else {
		return parsedZ;
	}
};

export default function zIndex(params) {
	return ((Component) => {
		const withZIndex = (props) => {
			if (!params) {
				return <Component {...props}/>;
			}

			const underlyingSelectors = params && params.above;

			let topmostZ = 0;

			if (underlyingSelectors) {
				const elements = document.querySelectorAll(underlyingSelectors);

				forEach(elements, (element) => {
					const z = getZIndex(element);

					if (z > topmostZ) {
						topmostZ = z;
					}
				});
			}

			let minimalZ = 0;

			if (typeof params === 'number') {
				minimalZ = params;
			} else if (params.min) {
				minimalZ = params.min;
			}

			if (topmostZ > minimalZ) {
				minimalZ = topmostZ + 1;
			}

			if (!minimalZ) {
				return <Component {...props}/>;
			}

			return <Component {...props} zIndex={minimalZ}/>;
		};

		return withZIndex;
	});
}
