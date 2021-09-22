import { Translator } from '@pipedrive/react-utils';

import {
	getMailTypeLabel,
	getMailOpenedTrackingStatusLabel,
	getMailLinkTrackingStatusLabel,
} from '../../../utils/filterUtils';
import {
	MailType,
	MailOpenedTrackingStatus,
	MailLinkClickedTrackingStatus,
} from '../../../utils/constants';

export type MailsEnumField =
	| MailType
	| MailOpenedTrackingStatus
	| MailLinkClickedTrackingStatus;

export const ENUM_TYPE_FIELDS = [
	'type',
	'openedTrackingStatus',
	'linkTrackingStatus',
];

export const getEnumFieldLabel = (
	primaryFilter: string,
	primaryFilterLabelValue: MailsEnumField,
	translator: Translator,
): string => {
	switch (primaryFilter) {
		case 'type':
			return getMailTypeLabel(
				primaryFilterLabelValue as MailType,
				translator,
			);
		case 'openedTrackingStatus':
			return getMailOpenedTrackingStatusLabel(
				primaryFilterLabelValue as MailOpenedTrackingStatus,
				translator,
			);
		case 'linkTrackingStatus':
			return getMailLinkTrackingStatusLabel(
				primaryFilterLabelValue as MailLinkClickedTrackingStatus,
				translator,
			);
		default:
			return '';
	}
};
