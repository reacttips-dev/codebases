import React, { useContext } from 'react';

import { Logger } from './Logger';

type Props = {
	logger: Logger;
};

const LoggerContext = React.createContext<Logger | null>(null);

export const LoggerProvider: React.FC<Props> = ({ logger, children }) => {
	return <LoggerContext.Provider value={logger}>{children}</LoggerContext.Provider>;
};

export function useLogger() {
	const logger = useContext(LoggerContext);
	if (logger == null) {
		throw new Error('useLogger must be used within a LoggerProvider');
	}

	return logger;
}
