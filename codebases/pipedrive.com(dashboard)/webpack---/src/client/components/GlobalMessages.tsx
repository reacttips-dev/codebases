import React, { useRef, useEffect } from 'react';
import useToolsContext from '../hooks/useToolsContext';
import { initGlobalMessages } from './Header/helpers/global-messages';
import { useRootSelector } from '../store';

export default function GlobalMessages() {
	const { hasRegisteredAllExternals } = useRootSelector((s) => s.navigation);
	const globalMessagesRef = useRef(null);
	const { componentLoader } = useToolsContext();

	useEffect(() => {
		if (hasRegisteredAllExternals) {
			initGlobalMessages(componentLoader, globalMessagesRef.current);
		}
	}, [hasRegisteredAllExternals]);

	return <div ref={globalMessagesRef} />;
}
