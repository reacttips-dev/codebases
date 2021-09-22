import React, { useState, useContext } from 'react';
import { graphql, createFragmentContainer } from '@pipedrive/relay';
import { Button, Icon } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import { LeadboxFiltersContext } from 'Leadbox/LeadboxFiltersContext';
import { useTracking } from 'Utils/metrics/useTracking';
import { labelsFilterApplied } from 'Utils/metrics/events/filters';
import { UserSettingFilterKeys } from 'Leadbox/UserSettingFilterKeys';
import { useSetUserSettingMutation } from 'Leadbox/ActionBar/SetUserSettingMutation';
import { useUnselectLead } from 'Hooks/useUnselectLead';
import { LabelsSelectPopover } from 'Components/LabelsSelect/LabelsSelectPopover';
import { labelCreated, labelDeleted, labelEdited } from 'Utils/metrics/events/labels';

import * as S from './LabelsFilter.styles';
import { Label } from './Label';
import { LabelsFilter_data } from './__generated__/LabelsFilter_data.graphql';

interface Props {
	readonly data: LabelsFilter_data;
}

export const LabelsFilterWithoutData: React.FC<Props> = ({ data }) => {
	const translator = useTranslator();
	const inboxFilters = useContext(LeadboxFiltersContext);
	const tracking = useTracking();
	const setUserSetting = useSetUserSettingMutation();
	const unselectLead = useUnselectLead();
	const [isOpen, setOpen] = useState(false);

	const labels = data.labels ?? [];
	const selectedLabelIDs = inboxFilters.get.filter.labels;

	const getSelectedLabels = (toggledID: string | null) => {
		if (!toggledID) {
			return [];
		}
		if (selectedLabelIDs.includes(toggledID)) {
			return selectedLabelIDs.filter((id) => id !== toggledID);
		}

		return [...selectedLabelIDs, toggledID];
	};

	const toggleLabelSelected = (labelID: string | null) => {
		inboxFilters.set.labelsFilter(labelID);
		unselectLead();

		const selectedLabelIDs = getSelectedLabels(labelID);

		setUserSetting(UserSettingFilterKeys.LABEL, selectedLabelIDs.join(','));

		const getSelectedLabelsForTracking = () => {
			if (labelID === null) {
				// all labels
				return labels.map((label) => ({ id: label?.id, name: label?.name }));
			}

			return selectedLabelIDs.map((id) => {
				const matchingLabel = labels.find((label) => label?.id === id);

				return { id: matchingLabel?.id, name: matchingLabel?.name };
			});
		};

		tracking.trackEvent(labelsFilterApplied(getSelectedLabelsForTracking(), labels.length));
	};

	const allLabels = (data.labels ?? []).flatMap((e) => (e ? [e] : []));

	const openPopover = () => setOpen(true);
	const onClose = () => setOpen(false);

	const onCreate = (labelNodeID: string) => {
		tracking.trackEvent(labelCreated());
	};

	const onEdit = () => {
		tracking.trackEvent(labelEdited());
	};

	const onDelete = (labelNodeID: string) => {
		tracking.trackEvent(labelDeleted());
	};

	const getButtonContent = () => {
		if (selectedLabelIDs.length === 1) {
			const label = labels.find((label) => label?.id === selectedLabelIDs[0]) ?? null;

			return <Label label={label} />;
		}
		if (selectedLabelIDs.length > 1) {
			return translator.ngettext('%d Label', '%d Labels', selectedLabelIDs.length, selectedLabelIDs.length);
		}

		return translator.gettext('All labels');
	};

	return (
		<S.LabelsSelectWrapper>
			<Button onClick={openPopover}>
				<Icon icon="ac-pricetag" size="s" />
				{getButtonContent()}
				<Icon icon="triangle-down" size="s" />
			</Button>
			<LabelsSelectPopover
				allLabels={allLabels}
				selectedLabelIds={selectedLabelIDs}
				isOpen={isOpen}
				onClose={onClose}
				onEdit={onEdit}
				onDelete={onDelete}
				onCreate={onCreate}
				onOptionChange={toggleLabelSelected}
			/>
		</S.LabelsSelectWrapper>
	);
};

export const LabelsFilter = createFragmentContainer(LabelsFilterWithoutData, {
	data: graphql`
		fragment LabelsFilter_data on RootQuery {
			labels {
				...LabelsSelectPopover_allLabels
				...Label_label
				id
				name
			}
		}
	`,
});
