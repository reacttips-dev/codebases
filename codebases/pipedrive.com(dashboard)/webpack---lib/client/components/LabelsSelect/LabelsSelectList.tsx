import { Icon, Input, Separator, Tooltip, Option } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import React, { useEffect, useRef, useState } from 'react';
import { createFragmentContainer, graphql } from '@pipedrive/relay';
import { useKeyPress } from 'Hooks/useKeyPress';
import { ConditionalWrapper } from 'Utils/conditionalRendering/ConditionalWrapper';
import { NoResults } from 'Components/NoResults/NoResults';

import * as S from './LabelsSelectList.styles';
import { LabelsSelectOption } from './LabelsSelectOption';
import { LabelsSelectList_allLabels } from './__generated__/LabelsSelectList_allLabels.graphql';

interface Props {
	readonly allLabels: LabelsSelectList_allLabels;
	readonly selectedLabelIds: Array<string>;
	readonly showAllLabelsOption: boolean;
	readonly onOptionChange: (labelKey: string | null) => void;
	readonly onClickNew: (prefillValue: string) => void;
	readonly onClickEdit: (labelId: string) => void;
	readonly searchValue: string;
	readonly setSearchValue: (searchValue: string) => void;
}

const LabelsSelectListWithoutData: React.FC<Props> = ({
	allLabels,
	selectedLabelIds,
	showAllLabelsOption,
	onOptionChange,
	onClickEdit,
	onClickNew,
	searchValue,
	setSearchValue,
}) => {
	const [filteredLabels, setFilteredLabels] = useState(allLabels ?? []);
	const [preselectedLabelID, setPreselectedLabelID] = useState<string | null>(null);

	const inputRef = useRef<HTMLInputElement>(null);
	const translator = useTranslator();

	const canAddLabel = (allLabels ?? []).length < 500;

	const onAddNewTrigger = (e: React.MouseEvent | KeyboardEvent) => {
		e.stopPropagation();
		onClickNew(searchValue);
	};

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}

		return () => setSearchValue('');
	}, [setSearchValue]);

	const onSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		setSearchValue(value);

		const labelsFilteredBySearch = (allLabels ?? []).reduce<Array<NonNullable<LabelsSelectList_allLabels>[0]>>(
			(acc, label) => {
				if (label == null) {
					return acc;
				}
				if (label.name?.toLowerCase().includes(value.toLowerCase())) {
					acc.push(label);
				}

				return acc;
			},
			[],
		);

		setFilteredLabels(labelsFilteredBySearch);

		if (!value) {
			return setPreselectedLabelID(null);
		}

		const firstFoundLabel = labelsFilteredBySearch[0];
		if (value && firstFoundLabel) {
			return setPreselectedLabelID(firstFoundLabel.id);
		} else {
			return setPreselectedLabelID('__new');
		}
	};

	const onEnter = (e: KeyboardEvent) => {
		if (preselectedLabelID === '__new') {
			return onAddNewTrigger(e);
		}

		if (preselectedLabelID) {
			return onOptionChange(preselectedLabelID);
		}
	};

	const hasFilteredLabels = Boolean(filteredLabels?.length);

	const onArrowKeypress = (e: KeyboardEvent, direction: 'up' | 'down') => {
		e.preventDefault();
		const changeIndex = (index: number) => (direction === 'up' ? index - 1 : index + 1);

		if (!hasFilteredLabels) {
			return;
		}

		if (!preselectedLabelID && hasFilteredLabels) {
			return setPreselectedLabelID(filteredLabels[0]?.id ?? null);
		}

		if (preselectedLabelID) {
			const currentPreselectedKeyIndex = filteredLabels.findIndex((label) => label?.id === preselectedLabelID);
			const nextKeyIndex = changeIndex(currentPreselectedKeyIndex);
			const nextKey = filteredLabels[nextKeyIndex]?.id;

			if (nextKey) {
				return setPreselectedLabelID(nextKey);
			} else if (preselectedLabelID === '__new') {
				return setPreselectedLabelID(filteredLabels[filteredLabels.length - 1]?.id ?? null);
			} else {
				return setPreselectedLabelID('__new');
			}
		}
	};

	useKeyPress('ArrowDown', (e) => onArrowKeypress(e, 'down'));
	useKeyPress('ArrowUp', (e) => onArrowKeypress(e, 'up'));
	useKeyPress('Enter', onEnter);

	return (
		<>
			<S.SearchWrapper>
				<Input
					allowClear
					inputRef={inputRef}
					onChange={onSearchInputChange}
					icon="ac-search"
					placeholder={translator.gettext('Search label')}
				/>
			</S.SearchWrapper>
			<Separator />
			<S.LabelsSelectOptionListWrapper>
				{hasFilteredLabels ? (
					<>
						{!showAllLabelsOption && (
							<>
								<Option onClick={() => onOptionChange(null)} selected={selectedLabelIds.length === 0}>
									{translator.gettext('All labels')}
								</Option>
								<div>
									<Separator />
								</div>
							</>
						)}

						{filteredLabels.map((label) => {
							if (!label) {
								return null;
							}

							return (
								<LabelsSelectOption
									key={label.id}
									label={label}
									selected={selectedLabelIds.some((id) => id === label.id)}
									onClick={onOptionChange}
									onEditClick={onClickEdit}
									highlighted={preselectedLabelID === label.id}
								/>
							);
						})}
					</>
				) : (
					<NoResults />
				)}
			</S.LabelsSelectOptionListWrapper>
			<Separator />
			<ConditionalWrapper
				condition={!canAddLabel}
				wrapper={(children) => (
					<Tooltip
						offset={-82}
						placement="top-start"
						portalTo={document.body}
						content={translator.gettext('You have reached the maximum number of labels (500)')}
					>
						{children}
					</Tooltip>
				)}
			>
				<S.AddNewButton
					disabled={!canAddLabel}
					highlighted={preselectedLabelID === '__new'}
					onClick={onAddNewTrigger}
					data-testid="AddNewButton"
				>
					<Icon icon="plus" size="s" color="blue" />
					{translator.gettext('Add new label')}
				</S.AddNewButton>
			</ConditionalWrapper>
		</>
	);
};

export const LabelsSelectList = createFragmentContainer(LabelsSelectListWithoutData, {
	allLabels: graphql`
		fragment LabelsSelectList_allLabels on Label @relay(plural: true) {
			id
			name
			...LabelsSelectOption_label
		}
	`,
});
