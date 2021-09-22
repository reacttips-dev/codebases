import fetch from '@pipedrive/fetch';

const completedTextMap = (translator) => {
	return {
		edit: {
			deal: (count) => translator.ngettext('%s deal edited', '%s deals edited', count, count),
			person: (count) => translator.ngettext('%s person edited', '%s people edited', count, count),
			organization: (count) =>
				translator.ngettext('%s organization edited', '%s organizations edited', count, count),
			activity: (count) => translator.ngettext('%s activity edited', '%s activities edited', count, count),
			product: (count) => translator.ngettext('%s product edited', '%s products edited', count, count),
		},
		delete: {
			deal: (count) => translator.ngettext('%s deal deleted', '%s deals deleted', count, count),
			person: (count) => translator.ngettext('%s person deleted', '%s people deleted', count, count),
			organization: (count) =>
				translator.ngettext('%s organization deleted', '%s organizations deleted', count, count),
			activity: (count) => translator.ngettext('%s activity deleted', '%s activities deleted', count, count),
			product: (count) => translator.ngettext('%s product deleted', '%s products deleted', count, count),
		},
	};
};

export const getMessage = (
	translator,
	{ action, entityType, success, progress, isCompleted, failedCount, succeededCount },
) => {
	if (isCompleted) {
		return completedTextMap(translator)[action][entityType](succeededCount);
	}

	if (action === 'delete') {
		if (failedCount) {
			return translator.gettext('Bulk delete completed, %s errors appeared', failedCount);
		}

		if (!success) {
			return translator.gettext("Can't start bulk delete");
		}

		return translator.gettext('Bulk delete %s in progress...', progress);
	}

	if (action === 'edit') {
		if (failedCount) {
			return translator.gettext('Bulk edit completed, %s errors appeared', failedCount);
		}

		if (!success) {
			return translator.gettext("Can't start bulk edit");
		}

		return translator.gettext('Bulk edit %s in progress...', progress);
	}

	return '';
};

let failures = 0;

export const poll = (url, setData, logger, stopPolling) => {
	(async () => {
		try {
			const { data, success } = await fetch(url);

			if (success) {
				setData(data);
			}
		} catch (error) {
			logger.logError(error, 'Could not fetch bulk edit status');

			failures++;

			if (failures > 8) {
				stopPolling();
			}
		}
	})();
};

export const stop = (id, url, setData, logger, stopPolling) => {
	(async () => {
		try {
			// stop polling to avoid status being overwritten
			stopPolling();

			const { data, success } = await fetch(`/api/v1/bulk-actions/${id}/cancel`, { method: 'post' });

			if (success) {
				setData(data);
			}
		} catch (error) {
			logger.logError(error, 'Could not stop bulk edit');
			// job might be completed before stop was clicked, fetch latest status
			poll(url, setData, logger, stopPolling);
		}
	})();
};
