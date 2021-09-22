import { Translator } from '@pipedrive/react-utils';

export enum SnackbarMessages {
	ACTION_FAILURE = 'ACTION_FAILURE',
	ACTION_REQUEST_UPSELL = 'ACTION_REQUEST_UPSELL',
	ACTION_REQUEST_ERROR = 'ACTION_REQUEST_ERROR',
	ACTION_DEAL_WON = 'ACTION_DEAL_WON',
}

export default function getMessage(
	translator: Translator,
	key: string,
	translatorReplacements: string[],
): string | null {
	if (key === SnackbarMessages.ACTION_FAILURE) {
		return translator.gettext('Something went wrong. Please try again.');
	}

	if (key === SnackbarMessages.ACTION_REQUEST_UPSELL) {
		return translator.gettext('Request sent to admins');
	}

	if (key === SnackbarMessages.ACTION_DEAL_WON) {
		return translator.gettext('%s is won', translatorReplacements);
	}

	return null;
}
