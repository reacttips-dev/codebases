import { useContext, useState } from 'react';
import { useTranslator } from '@pipedrive/react-utils';
import { getTranslatedSourceName } from 'Components/SourceLabel/SourceLabel';
import { UserSettingFilterKeys } from 'Leadbox/UserSettingFilterKeys';
import { WebappApiContext } from 'Components/WebappApiContext';
import { LeadboxFiltersContext } from 'Leadbox/LeadboxFiltersContext';
import { graphql, readInlineData } from '@pipedrive/relay';
import { useTracking } from 'Utils/metrics/useTracking';
import { sourceFilterApplied } from 'Utils/metrics/events/filters';
import { useSetUserSettingMutation } from 'Leadbox/ActionBar/SetUserSettingMutation';
import { useUnselectLead } from 'Hooks/useUnselectLead';

import type { useSourceFilter_source$key } from './__generated__/useSourceFilter_source.graphql';
import type { useSourceFilter_data$key, LeadSourceIcon } from './__generated__/useSourceFilter_data.graphql';

export const useSourceFilter = (props: useSourceFilter_data$key | null) => {
	const data = readInlineData(
		graphql`
			fragment useSourceFilter_data on RootQuery @inline {
				leadSources {
					...useSourceFilter_source
					...SourceLabel_source
					id
					name
					iconName
				}
			}
		`,
		props,
	);

	const translator = useTranslator();
	const unselectLead = useUnselectLead();
	const tracking = useTracking();
	const inboxFilters = useContext(LeadboxFiltersContext);
	const [searchValue, setSearchValue] = useState('');

	const setUserSetting = useSetUserSettingMutation();

	const selectedSourceIDs = inboxFilters.get.filter.sources;

	const getSelectedSourceIDs = (sourceID: string | null) => {
		// Fixes a race condition: the tracking needs the latest state of selectedSourceIDs
		if (!sourceID) {
			return [];
		}
		if (selectedSourceIDs.includes(sourceID)) {
			return selectedSourceIDs.filter((id) => id !== sourceID);
		}

		return [...selectedSourceIDs, sourceID];
	};

	const apiContext = useContext(WebappApiContext);

	const filterOutInactiveSource = (sourceKey: useSourceFilter_source$key): boolean => {
		const guardData = readInlineData(
			graphql`
				fragment useSourceFilter_source on LeadSource @inline {
					iconName
				}
			`,
			sourceKey,
		);

		const sourcesBehindFlags: { [s in LeadSourceIcon]?: boolean } = {
			LIVE_CHAT: apiContext.isLiveChatEnabled,
			PROSPECTOR: apiContext.isProspectorEnabled,
			WORKFLOW_AUTOMATION: apiContext.isWorkflowAutomationEnabled,
		};

		const iconName = guardData.iconName ?? 'LEADBOX';
		if (!Object.keys(sourcesBehindFlags).includes(iconName)) {
			return true;
		}

		return sourcesBehindFlags[iconName] ?? true;
	};

	const sources =
		data?.leadSources?.filter((leadSource) => {
			if (leadSource !== null) {
				return filterOutInactiveSource(leadSource);
			}
		}) ?? [];

	const toggleSourceSelected = (sourceID: string | null) => {
		inboxFilters.set.sourceFilter(sourceID);
		unselectLead();

		const selectedSourceIDs = getSelectedSourceIDs(sourceID);

		setUserSetting(UserSettingFilterKeys.SOURCE, selectedSourceIDs.join(',') || null);

		const getSelectedSourcesForTracking = () => {
			if (sourceID === null) {
				// all sources
				return sources.map((source) => ({ id: source?.id, name: source?.name }));
			}

			return selectedSourceIDs.map((id) => {
				const matchingSource = sources.find((source) => source?.id === id);

				return { id: matchingSource?.id, name: matchingSource?.name };
			});
		};

		tracking.trackEvent(sourceFilterApplied(getSelectedSourcesForTracking(), sources.length));
	};

	const getButtonPlaceholder = (selectedSourceIDs: Array<string>): string | undefined => {
		if (selectedSourceIDs.length === 1) {
			const source = sources.find((source) => source?.id === selectedSourceIDs[0]) ?? null;

			return getTranslatedSourceName(source?.iconName ?? null, translator) ?? undefined;
		}

		if (selectedSourceIDs.length > 1) {
			return translator.gettext('%d sources', selectedSourceIDs.length);
		}

		return translator.gettext('All sources');
	};

	const visibleSources = searchValue
		? sources.filter((source) => {
				const name = getTranslatedSourceName(source?.iconName ?? null, translator);

				return name?.toLowerCase().includes(searchValue.toLowerCase());
		  })
		: sources;

	return {
		sources,
		selectedSourceIDs,
		visibleSources,
		getButtonPlaceholder,
		setSearchValue,
		toggleSourceSelected,
	};
};
