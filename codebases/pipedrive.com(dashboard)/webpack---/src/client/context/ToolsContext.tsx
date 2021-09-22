import React from 'react';
import { Logger } from '@pipedrive/react-utils';
import { FrootRouter } from '../tools/router';

interface ToolsContext {
	componentLoader: ComponentLoader;
	logger: Logger;
	router: FrootRouter;
	metrics: any;
	iamClient: any;
	interfaceTour: any;
}

const ToolsContext = React.createContext<ToolsContext>({
	componentLoader: null,
	logger: null,
	router: null,
	metrics: null,
	iamClient: null,
	interfaceTour: null,
});

export default ToolsContext;
