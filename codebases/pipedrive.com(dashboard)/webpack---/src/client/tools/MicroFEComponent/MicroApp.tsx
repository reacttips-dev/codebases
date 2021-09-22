import React, { useEffect, useRef } from 'react';

import usePreviousProps from '../../hooks/usePreviousProps';

const callAppFunction = async (app, func, args = [], callback = null) => {
	if (!app || !app[func]) {
		return;
	}

	await app[func](...args);

	callback && callback();
};

interface Props {
	app: {
		mount({ el: HTMLElement, props: any }): Promise<null>;
		unmount?({ el: HTMLElement }): Promise<null>;
		update?({ el: HTMLElement, prevProps, props: any }): Promise<null>;
	};
	props: any;
	onLoad?: () => {};
}

function MicroApp({ app, props = {} }: Props) {
	const ref = useRef<HTMLDivElement>(null);
	const appRef = useRef(null);
	const isMounted = useRef(false);
	const prevProps = usePreviousProps(props);

	useEffect(() => {
		if (app) {
			appRef.current = app;

			const { mount } = app;

			if (mount) {
				const { onLoad } = props;

				callAppFunction(appRef.current, 'mount', [{ el: ref.current, props }], () => {
					onLoad && onLoad();
				});

				return () => {
					callAppFunction(appRef.current, 'unmount', [{ el: ref.current }]);
				};
			}
		}
	}, [app]);

	useEffect(() => {
		if (isMounted.current) {
			callAppFunction(appRef.current, 'update', [{ el: ref.current, props, prevProps }]);
		}

		isMounted.current = true;
	}, [props]);

	return <div style={{ height: '100%' }} ref={ref}></div>;
}

export default MicroApp;
