import React, { useEffect, useState } from 'react';
import {
	Button,
	ButtonGroup,
	Icon,
	Option,
	Popover,
	Spacing,
	PopoverPlacement,
} from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import { MultiSelectFilterOption } from '../../types/chart';
import Search from '../../shared/search';

import styles from './MultiSelectChartFilter.pcss';

interface MultiSelectChartFilterProps {
	options: MultiSelectFilterOption[];
	selectedOptionsIds: number[];
	onClick: any;
	placement: PopoverPlacement;
}

const MultiSelectChartFilter: React.FC<MultiSelectChartFilterProps> = ({
	options,
	selectedOptionsIds,
	onClick,
	placement,
}) => {
	const translator = useTranslator();
	const [filters, setFilters] = useState(options);
	const [isPopoverVisible, setPopoverVisible] = useState(false);
	const optionsIds = options.map((option) => option.id);
	const excludedOptions = optionsIds.filter(
		(id) => !selectedOptionsIds?.includes(id),
	);
	const excludedOptionsCount = excludedOptions.length;

	const getValue = () => {
		if (excludedOptionsCount === 0) {
			return translator.gettext('All stages included');
		}

		return translator.ngettext(
			'%d stage excluded',
			'%d stages excluded',
			excludedOptionsCount,
			excludedOptionsCount,
		);
	};

	useEffect(() => {
		setFilters(options);
	}, [options]);

	const toggleOption = (clickedId: number) => {
		return optionsIds.filter((id) => {
			if (id === clickedId) {
				return !selectedOptionsIds?.includes(id);
			}

			return selectedOptionsIds?.includes(id);
		});
	};

	const setOptions = ({
		selectAll,
		clickedId,
	}: {
		selectAll: boolean;
		clickedId?: number;
	}) => {
		if (selectAll) {
			onClick(optionsIds);
		} else {
			const updatedOptions = toggleOption(clickedId);

			onClick(updatedOptions);
		}
	};

	return (
		<>
			<div className={styles.label}>{translator.gettext('View by')}</div>
			<Popover
				portalTo={document.body}
				placement={placement}
				spacing={{ horizontal: 'none', vertical: 's' }}
				visible={isPopoverVisible}
				onPopupVisibleChange={() => setPopoverVisible(false)}
				toggleOnTriggerClick={false}
				content={
					<div className={styles.popover}>
						<Spacing horizontal="s" bottom="s">
							<Search
								array={options}
								setSearchableObject={setFilters}
								placeholder={translator.gettext('Search')}
								shouldAutoFocus
							/>
						</Spacing>

						<div
							className={styles.options}
							data-test="multi-select-list"
						>
							{filters.map((option, index) => {
								const currentSelectedOption =
									selectedOptionsIds?.includes(option.id);

								return (
									<Option
										key={index}
										onClick={() =>
											setOptions({
												selectAll: false,
												clickedId: option.id,
											})
										}
										selected={currentSelectedOption}
										disabled={
											currentSelectedOption &&
											selectedOptionsIds.length === 1
										}
										data-test="multi-select-option"
									>
										{option.label}
									</Option>
								);
							})}
						</div>
					</div>
				}
			>
				<ButtonGroup>
					<Button
						onClick={() => setPopoverVisible(true)}
						data-test="multi-select-button"
					>
						{getValue()}
						<Icon icon="triangle-down" size="s" />
					</Button>

					{excludedOptionsCount > 0 && (
						<Button onClick={() => setOptions({ selectAll: true })}>
							<Icon icon="cross" size="s" />
						</Button>
					)}
				</ButtonGroup>
			</Popover>
		</>
	);
};

export default MultiSelectChartFilter;
