import Logger from '@pipedrive/logger-fe';
import { UserSelf } from 'Types/@pipedrive/webapp';
import { ModalErrors, ModalType } from 'Types/types';

type Context = { [key in string]: string | number };

export const ADD_MODALS_SERVICE_NAME = 'add-modals';

export default function getLogger(userSelf: UserSelf, modalType: ModalType) {
	const logger = new Logger(ADD_MODALS_SERVICE_NAME);
	const userId = userSelf.get('id');
	const companyId = userSelf.get('company_id');

	return {
		error: (message: string, error: Error, context: Context = {}) => {
			logger.remote(
				'error',
				message,
				{
					modalType,
					caughtErrorStack: error.stack,
					caughtErrorMessage: error.message,
					company_id: companyId,
					user_id: userId,
					...context,
				},
				ADD_MODALS_SERVICE_NAME,
			);
		},
		warning: (message: string, context: Context = {}) => {
			logger.remote(
				'warning',
				message,
				{
					modalType,
					company_id: companyId,
					user_id: userId,
					...context,
				},
				ADD_MODALS_SERVICE_NAME,
			);
		},
		info: (message: string, errors?: ModalErrors) => {
			logger.remote(
				'info',
				message,
				{
					modalType,
					company_id: companyId,
					user_id: userId,
					errors,
				},
				ADD_MODALS_SERVICE_NAME,
			);
		},
	};
}

export type InternalLogger = ReturnType<typeof getLogger>;
