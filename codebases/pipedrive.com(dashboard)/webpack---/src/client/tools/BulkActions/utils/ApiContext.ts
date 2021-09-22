import { FFContextDataType } from '@pipedrive/form-fields';
import Logger from '@pipedrive/logger-fe';
import TranslatorClient from '@pipedrive/translator-client';
import { ComponentLoader } from '@pipedrive/types';
import React from 'react';

import { BulkEditParams } from '../types';

export interface ApiContext {
	componentLoader: ComponentLoader;
	translator: TranslatorClient;
	user: any;
	ffContextData: FFContextDataType;
	bulkParams: BulkEditParams;
	logger: Logger;
}

const defaultValue: ApiContext = {
	componentLoader: null,
	translator: null,
	user: null,
	ffContextData: null,
	bulkParams: null,
	logger: null,
};

export const ApiContext = React.createContext(defaultValue);
