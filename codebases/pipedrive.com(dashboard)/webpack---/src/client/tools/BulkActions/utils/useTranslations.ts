import { useContext } from 'react';

import { ApiContext } from './ApiContext';

interface Props {
	translator?: any;
}

export function useTranslations(props?: Props) {
	const translator = props?.translator || useContext(ApiContext)?.translator;

	return {
		editActionTextMap: {
			deal: (count) => translator.ngettext('Edit %d deal', 'Edit %d deals', count, count),
			person: (count) => translator.ngettext('Edit %d person', 'Edit %d persons', count, count),
			organization: (count) => translator.ngettext('Edit %d organization', 'Edit %d organizations', count, count),
			activity: (count) => translator.ngettext('Edit %d activity', 'Edit %d activities', count, count),
			product: (count) => translator.ngettext('Edit %d product', 'Edit %d products', count, count),
		},
		editConfirmationTextMap: {
			deal: (count) =>
				translator.ngettext(
					'You’re about to make changes to %s deal',
					'You’re about to make changes to %s deals',
					count,
					`<strong>${count}</strong>`,
				),
			person: (count) =>
				translator.ngettext(
					'You’re about to make changes to %s person',
					'You’re about to make changes to %s persons',
					count,
					`<strong>${count}</strong>`,
				),
			organization: (count) =>
				translator.ngettext(
					'You’re about to make changes to %s organization',
					'You’re about to make changes to %s organizations',
					count,
					`<strong>${count}</strong>`,
				),
			activity: (count) =>
				translator.ngettext(
					'You’re about to make changes to %s activity',
					'You’re about to make changes to %s activities',
					count,
					`<strong>${count}</strong>`,
				),
			product: (count) =>
				translator.ngettext(
					'You’re about to make changes to %s product',
					'You’re about to make changes to %s products',
					count,
					`<strong>${count}</strong>`,
				),
		},
		deleteConfirmationTextMap: {
			deal: (count) =>
				translator.ngettext(
					'Are you sure you wish to delete the %d deal selected?',
					'Are you sure you wish to delete the %d deals selected?',
					count,
					count,
				),
			person: (count) =>
				translator.ngettext(
					'Are you sure you wish to delete the %d person selected?',
					'Are you sure you wish to delete the %d people selected?',
					count,
					count,
				),
			organization: (count) =>
				translator.ngettext(
					'Are you sure you wish to delete the %d organization selected?',
					'Are you sure you wish to delete the %d organizations selected?',
					count,
					count,
				),
			activity: (count) =>
				translator.ngettext(
					'Are you sure you wish to delete the %d activity selected?',
					'Are you sure you wish to delete the %d activities selected?',
					count,
					count,
				),
			product: (count) =>
				translator.ngettext(
					'Are you sure you wish to delete the %d product selected?',
					'Are you sure you wish to delete the %d products selected?',
					count,
					count,
				),
		},
		completedSummaryTextMap: {
			edit: translator.gettext('Bulk edit summary'),
			delete: translator.gettext('Bulk delete summary'),
		},
		canceledSummaryTextMap: {
			edit: translator.gettext('Bulk edit stopped'),
			delete: translator.gettext('Bulk delete stopped'),
		},
		completedMessageTextMap: {
			edit: {
				deal: (count) =>
					translator.ngettext(
						"We weren't able to edit %d deal. Sorry, something went wrong there.",
						"We weren't able to edit %d deals. Sorry, something went wrong there.",
						count,
						count,
					),
				person: (count) =>
					translator.ngettext(
						"We weren't able to edit %d person. Sorry, something went wrong there.",
						"We weren't able to edit %d people. Sorry, something went wrong there.",
						count,
						count,
					),
				organization: (count) =>
					translator.ngettext(
						"We weren't able to edit %d organization. Sorry, something went wrong there.",
						"We weren't able to edit %d organizations. Sorry, something went wrong there.",
						count,
						count,
					),
				activity: (count) =>
					translator.ngettext(
						"We weren't able to edit %d activity. Sorry, something went wrong there.",
						"We weren't able to edit %d activities. Sorry, something went wrong there.",
						count,
						count,
					),
				product: (count) =>
					translator.ngettext(
						"We weren't able to edit %d product. Sorry, something went wrong there.",
						"We weren't able to edit %d products. Sorry, something went wrong there.",
						count,
						count,
					),
			},
			delete: {
				deal: (count) =>
					translator.ngettext(
						"We weren't able to delete %d deal. Sorry, something went wrong there.",
						"We weren't able to delete %d deals. Sorry, something went wrong there.",
						count,
						count,
					),
				person: (count) =>
					translator.ngettext(
						"We weren't able to delete %d person. Sorry, something went wrong there.",
						"We weren't able to delete %d persons. Sorry, something went wrong there.",
						count,
						count,
					),
				organization: (count) =>
					translator.ngettext(
						"We weren't able to delete %d organization. Sorry, something went wrong there.",
						"We weren't able to delete %d organizations. Sorry, something went wrong there.",
						count,
						count,
					),
				activity: (count) =>
					translator.ngettext(
						"We weren't able to delete %d activity. Sorry, something went wrong there.",
						"We weren't able to delete %d activities. Sorry, something went wrong there.",
						count,
						count,
					),
				product: (count) =>
					translator.ngettext(
						"We weren't able to delete %d product. Sorry, something went wrong there.",
						"We weren't able to delete %d products. Sorry, something went wrong there.",
						count,
						count,
					),
			},
		},
		completedLabelTextMap: {
			edit: {
				deal: (count, startTag, endTag) =>
					translator.ngettext('%1$s %3$d %2$s deal was edited:', '%1$s %3$d %2$s deals were edited:', count, [
						startTag,
						endTag,
						count,
					]),
				person: (count, startTag, endTag) =>
					translator.ngettext(
						'%1$s %3$d %2$s person was edited:',
						'%1$s %3$d %2$s people were edited:',
						count,
						[startTag, endTag, count],
					),
				organization: (count, startTag, endTag) =>
					translator.ngettext(
						'%1$s %3$d %2$s organization was edited:',
						'%1$s %3$d %2$s organizations were edited:',
						count,
						[startTag, endTag, count],
					),
				activity: (count, startTag, endTag) =>
					translator.ngettext(
						'%1$s %3$d %2$s activity was edited:',
						'%1$s %3$d %2$s activities were edited:',
						count,
						[startTag, endTag, count],
					),
				product: (count, startTag, endTag) =>
					translator.ngettext(
						'%1$s %3$d %2$s product was edited:',
						'%1$s %3$d %2$s products were edited:',
						count,
						[startTag, endTag, count],
					),
			},
			delete: {
				deal: (count, startTag, endTag) =>
					translator.ngettext(
						'%1$s %3$d %2$s deal was successfully deleted.',
						'%1$s %3$d %2$s deals were successfully deleted.',
						count,
						[startTag, endTag, count],
					),
				person: (count, startTag, endTag) =>
					translator.ngettext(
						'%1$s %3$d %2$s person was successfully deleted.',
						'%1$s %3$d %2$s people were successfully deleted.',
						count,
						[startTag, endTag, count],
					),
				organization: (count, startTag, endTag) =>
					translator.ngettext(
						'%1$s %3$d %2$s organization was successfully deleted.',
						'%1$s %3$d %2$s organizations were successfully deleted.',
						count,
						[startTag, endTag, count],
					),
				activity: (count, startTag, endTag) =>
					translator.ngettext(
						'%1$s %3$d %2$s activity was successfully deleted.',
						'%1$s %3$d %2$s activities were successfully deleted.',
						count,
						[startTag, endTag, count],
					),
				product: (count, startTag, endTag) =>
					translator.ngettext(
						'%1$s %3$d %2$s product was successfully deleted.',
						'%1$s %3$d %2$s products were successfully deleted.',
						count,
						[startTag, endTag, count],
					),
			},
		},
		canceledLabelPreTextMap: {
			edit: translator.gettext('You have stopped the editing.'),
			delete: translator.gettext('You have stopped the deleting.'),
		},
		canceledLabelTextMap: {
			edit: {
				deal: (canceledCount, succeededCount, startTag, endTag) => [
					translator.ngettext(
						'%1$s %3$d %2$s deal was not edited yet.',
						'%1$s %3$d %2$s deals were not edited yet.',
						canceledCount,
						[startTag, endTag, canceledCount],
					),
					translator.ngettext(
						'%1$s %3$d %2$s deal was already edited.',
						'%1$s %3$d %2$s deals were already edited.',
						succeededCount,
						[startTag, endTag, succeededCount],
					),
				],
				person: (canceledCount, succeededCount, startTag, endTag) => [
					translator.ngettext(
						'%1$s %3$d %2$s person was not edited yet.',
						'%1$s %3$d %2$s people were not edited yet.',
						canceledCount,
						[startTag, endTag, canceledCount],
					),
					translator.ngettext(
						'%1$s %3$d %2$s person was already edited.',
						'%1$s %3$d %2$s people were already edited.',
						succeededCount,
						[startTag, endTag, succeededCount],
					),
				],
				organization: (canceledCount, succeededCount, startTag, endTag) => [
					translator.ngettext(
						'%1$s %3$d %2$s organization was not edited yet.',
						'%1$s %3$d %2$s organizations were not edited yet.',
						canceledCount,
						[startTag, endTag, canceledCount],
					),
					translator.ngettext(
						'%1$s %3$d %2$s organization was already edited.',
						'%1$s %3$d %2$s organizations were already edited.',
						succeededCount,
						[startTag, endTag, succeededCount],
					),
				],
				activity: (canceledCount, succeededCount, startTag, endTag) => [
					translator.ngettext(
						'%1$s %3$d %2$s activity was not edited yet.',
						'%1$s %3$d %2$s activities were not edited yet.',
						canceledCount,
						[startTag, endTag, canceledCount],
					),
					translator.ngettext(
						'%1$s %3$d %2$s activity was already edited.',
						'%1$s %3$d %2$s activities were already edited.',
						succeededCount,
						[startTag, endTag, succeededCount],
					),
				],
				product: (canceledCount, succeededCount, startTag, endTag) => [
					translator.ngettext(
						'%1$s %3$d %2$s product was not edited yet.',
						'%1$s %3$d %2$s products were not edited yet.',
						canceledCount,
						[startTag, endTag, canceledCount],
					),
					translator.ngettext(
						'%1$s %3$d %2$s product was already edited.',
						'%1$s %3$d %2$s products were already edited.',
						succeededCount,
						[startTag, endTag, succeededCount],
					),
				],
			},
			delete: {
				deal: (canceledCount, succeededCount, startTag, endTag) => [
					translator.ngettext(
						'%1$s %3$d %2$s deal was not deleted.',
						'%1$s %3$d %2$s deals were not deleted.',
						canceledCount,
						[startTag, endTag, canceledCount],
					),
					translator.ngettext(
						'%1$s %3$d %2$s deal was already deleted.',
						'%1$s %3$d %2$s deals were already deleted.',
						succeededCount,
						[startTag, endTag, succeededCount],
					),
				],
				person: (canceledCount, succeededCount, startTag, endTag) => [
					translator.ngettext(
						'%1$s %3$d %2$s person was not deleted.',
						'%1$s %3$d %2$s people were not deleted.',
						canceledCount,
						[startTag, endTag, canceledCount],
					),
					translator.ngettext(
						'%1$s %3$d %2$s person was already deleted.',
						'%1$s %3$d %2$s people were already deleted.',
						succeededCount,
						[startTag, endTag, succeededCount],
					),
				],
				organization: (canceledCount, succeededCount, startTag, endTag) => [
					translator.ngettext(
						'%1$s %3$d %2$s organization was not deleted.',
						'%1$s %3$d %2$s organizations were not deleted.',
						canceledCount,
						[startTag, endTag, canceledCount],
					),
					translator.ngettext(
						'%1$s %3$d %2$s organization was already deleted.',
						'%1$s %3$d %2$s organizations were already deleted.',
						succeededCount,
						[startTag, endTag, succeededCount],
					),
				],
				activity: (canceledCount, succeededCount, startTag, endTag) => [
					translator.ngettext(
						'%1$s %3$d %2$s activity was not deleted.',
						'%1$s %3$d %2$s activities were not deleted.',
						canceledCount,
						[startTag, endTag, canceledCount],
					),
					translator.ngettext(
						'%1$s %3$d %2$s activity was already deleted.',
						'%1$s %3$d %2$s activities were already deleted.',
						succeededCount,
						[startTag, endTag, succeededCount],
					),
				],
				product: (canceledCount, succeededCount, startTag, endTag) => [
					translator.ngettext(
						'%1$s %3$d %2$s product was not deleted.',
						'%1$s %3$d %2$s products were not deleted.',
						canceledCount,
						[startTag, endTag, canceledCount],
					),
					translator.ngettext(
						'%1$s %3$d %2$s product was already deleted.',
						'%1$s %3$d %2$s products were already deleted.',
						succeededCount,
						[startTag, endTag, succeededCount],
					),
				],
			},
		},
		formFieldErrorTextMap: {
			deal: () => translator.gettext('Deal not found. Please create it first.'),
			person: () => translator.gettext('Person not found. Please create it first.'),
			organization: () => translator.gettext('Organization not found. Please create it first.'),
		},
	};
}
