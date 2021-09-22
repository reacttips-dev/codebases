import { invariant } from '@adeira/js';

import { PipedriveConnectionHandler } from './connection/PipedriveConnectionHandler';

export function PipedriveHandlerProvider(handle: string) {
	invariant(handle === 'connection', 'PipedriveHandlerProvider: No handler provided for `%s`.', handle);

	return PipedriveConnectionHandler;
}
