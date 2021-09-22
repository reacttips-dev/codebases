import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useReactiveVar } from '@apollo/client';
import {
	Button,
	Icon,
	Option,
	Popover,
	Separator,
	Spacing,
	Tooltip,
} from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';

import {
	getCustomFieldsFilters,
	getDateFilters,
	getMainFilters,
} from '../../utils/filterUtils';
import {
	ChartFilterType,
	CoachmarkTags,
	DEAL_PRODUCTS_PRODUCT_ID,
	NO_SEGMENT,
	PROGRESS_DEFAULT_GROUPING,
} from '../../utils/constants';
import usePlanPermissions from '../../hooks/usePlanPermissions';
import { isCustomFieldsIndicesFlagEnabled } from '../../api/webapp';
import Search from '../../shared/search';
import Coachmark from '../Coachmark';
import useFilterState from '../../molecules/VisualBuilder/useFilterState';
import useOnboardingCoachmarks from '../../utils/onboardingCoachmarkUtils';
import ConditionalWrapper from '../../utils/ConditionalWrapper';
import { isViewInFocusVar } from '../../api/vars/settingsApi';

import styles from './ChartFilter.pcss';

export enum ChartFilterLabelTruncation {
	NONE,
	XSMALL,
	SMALL,
	MEDIUM,
	LARGE,
	XLARGE,
}

interface ChartFilterProps {
	type: ChartFilterType;
	options: any;
	value: string | insightsTypes.Interval | boolean;
	onClick: any;
	placement: any;
	selectedInterval?: insightsTypes.Interval | boolean;
	groupByFilterStyle?: string;
	disabled?: boolean;
	showCoachmark?: boolean;
	isNewCustomFieldButtonVisible?: boolean;
	isProgressReport?: boolean;
	label?: string;
	labelTruncation?: ChartFilterLabelTruncation;
	showViewByCoachmark?: boolean;
}

const ChartFilter: React.FC<ChartFilterProps> = ({
	type,
	options,
	value,
	onClick,
	placement,
	selectedInterval,
	groupByFilterStyle,
	disabled = false,
	isNewCustomFieldButtonVisible = true,
	isProgressReport = false,
	labelTruncation = ChartFilterLabelTruncation.NONE,
	label,
	showViewByCoachmark = false,
}) => {
	const translator = useTranslator();
	const { setSegmentByFilter } = useFilterState();
	const { isAdmin } = usePlanPermissions();

	const selectedOption = options.find((option: any) => option.name === value);
	const [mainFilters, setMainFilters] = useState(options);
	const [dateFilters, setDateFilters] = useState(options);
	const [customFieldsFilters, setCustomFieldsFilters] = useState(options);
	const [isPopoverVisible, setPopoverVisible] = useState(false);
	const [searchableObject, setSearchableObject] = useState(options);

	const hasRightsToAddCustomField =
		isAdmin && isCustomFieldsIndicesFlagEnabled();

	const isViewInFocus = useReactiveVar(isViewInFocusVar);

	useEffect(() => {
		setMainFilters(getMainFilters(searchableObject));
		setDateFilters(getDateFilters(searchableObject));
		setCustomFieldsFilters(getCustomFieldsFilters(searchableObject));
	}, [searchableObject]);

	useEffect(() => {
		setSearchableObject(options);
	}, [options]);

	const { INSIGHTS_ONBOARDING_CUSTOMIZE_REPORT_VIEW_BY_COACHMARK } =
		CoachmarkTags;

	const { visible: coachMarkIsVisible, close: closeCoachmark } =
		useOnboardingCoachmarks()[
			INSIGHTS_ONBOARDING_CUSTOMIZE_REPORT_VIEW_BY_COACHMARK
		];

	const handleProgressReportOptionChange = (optionName: string) => {
		return optionName === PROGRESS_DEFAULT_GROUPING
			? // Segmenting is visually disabled for Deal Progress report until we re-write the API for it
			  // Here: segment by value is set to "None" when view by is "Stage entered" (`stageId`)
			  setSegmentByFilter(NO_SEGMENT /* PROGRESS_DEFAULT_SEGMENT */)
			: setSegmentByFilter(PROGRESS_DEFAULT_GROUPING);
	};

	const handleOptionClick = (option: any) => {
		option.isOptionWithIntervals
			? onClick(option.name, selectedInterval)
			: onClick(option.name);

		if (isProgressReport) {
			handleProgressReportOptionChange(option.name);
		}

		if (
			option.name === DEAL_PRODUCTS_PRODUCT_ID &&
			type === ChartFilterType.GROUP_BY
		) {
			setSegmentByFilter(NO_SEGMENT);
		}

		setPopoverVisible(false);
		setSearchableObject(options);
	};

	const shouldDisplayOtherFieldsSegment = ![
		ChartFilterType.INTERVAL,
		ChartFilterType.IS_CUMULATIVE,
	].includes(type);

	const renderMainFiltersBlock = () => {
		return (
			<>
				{shouldDisplayOtherFieldsSegment && (
					<Separator type="block">
						{translator.gettext('Other fields')}
					</Separator>
				)}
				{mainFilters.map((option: any) => {
					const setTooltipVisibleProps = {
						...(!option.disabled && { visible: false }),
					};

					return (
						<Tooltip
							className={styles.tooltip}
							key={option.name}
							placement="left"
							content={option.tooltipText}
							portalTo={document.body}
							{...setTooltipVisibleProps}
						>
							<Option
								onClick={() => handleOptionClick(option)}
								disabled={option.disabled}
								selected={value === option.name}
								data-test={`group-by-or-measure-by-option-${option.label}`}
							>
								{option.label}
							</Option>
						</Tooltip>
					);
				})}
			</>
		);
	};

	const renderDateFiltersBlock = () => {
		if (dateFilters.length === 0) {
			return null;
		}

		return (
			<>
				<Separator type="block">
					{translator.gettext('Date fields')}
				</Separator>
				{dateFilters.map((option: any) => (
					<Option
						key={option.name}
						onClick={() => handleOptionClick(option)}
						selected={value === option.name}
					>
						{option.label}
					</Option>
				))}
			</>
		);
	};

	const renderCustomFiltersBlock = () => {
		if (customFieldsFilters.length === 0) {
			return null;
		}

		return (
			<>
				<Separator type="block">
					{isCustomFieldsIndicesFlagEnabled()
						? translator.gettext('Custom fields')
						: translator.gettext(
								'Custom fields (Professional plan)',
						  )}
				</Separator>
				{customFieldsFilters.map((option: any) => (
					<Option
						key={option.name}
						onClick={() => handleOptionClick(option)}
						disabled={!isCustomFieldsIndicesFlagEnabled()}
						selected={value === option.name}
					>
						{option.label}
					</Option>
				))}
			</>
		);
	};

	return (
		<div className={styles.filterRow}>
			{label && <div className={styles.label}>{label}</div>}

			<Popover
				portalTo={document.body}
				placement={placement}
				spacing={{ horizontal: 'none', vertical: 's' }}
				visible={isPopoverVisible}
				onPopupVisibleChange={() => setPopoverVisible(false)}
				toggleOnTriggerClick={false}
				content={
					<div className={styles.popover}>
						{type !== ChartFilterType.IS_CUMULATIVE && (
							<Spacing horizontal="s" bottom="s">
								<Search
									array={options}
									setSearchableObject={setSearchableObject}
									placeholder={translator.gettext('Search')}
									shouldAutoFocus
								/>
							</Spacing>
						)}

						<div className={styles.options}>
							{renderCustomFiltersBlock()}
							{renderMainFiltersBlock()}
							{renderDateFiltersBlock()}
						</div>
						{hasRightsToAddCustomField &&
							isNewCustomFieldButtonVisible && (
								<>
									<Separator />
									<div className={styles.footer}>
										<a
											href="/settings/fields"
											target="_blank"
											rel="noopener noreferrer"
											className={styles.footerLink}
										>
											<Icon
												icon="plus"
												size="s"
												color="blue"
											/>
											<span className={styles.linkText}>
												{translator.gettext(
													'New custom field',
												)}
											</span>
											<Icon
												icon="redirect"
												className={styles.redirect}
												color="black-64"
											/>
										</a>
									</div>
								</>
							)}
					</div>
				}
			>
				<Button
					className={classNames(styles.button, {
						[styles.limitedWidthXLarge]:
							labelTruncation ===
							ChartFilterLabelTruncation.XLARGE,
						[styles.limitedWidthLarge]:
							labelTruncation ===
							ChartFilterLabelTruncation.LARGE,
						[styles.limitedWidthMedium]:
							labelTruncation ===
							ChartFilterLabelTruncation.MEDIUM,
						[styles.limitedWidthSmall]:
							labelTruncation ===
							ChartFilterLabelTruncation.SMALL,
						[styles.limitedWidthXSmall]:
							labelTruncation ===
							ChartFilterLabelTruncation.XSMALL,
						[styles.rotatedButton]:
							groupByFilterStyle === 'vertical',
					})}
					onClick={() => {
						setPopoverVisible(true);
						coachMarkIsVisible && closeCoachmark();
					}}
					disabled={disabled}
					data-test={`chart-filter-type-${type}`}
				>
					{selectedOption?.label ?? value}
					<ConditionalWrapper
						condition={
							showViewByCoachmark &&
							isViewInFocus &&
							coachMarkIsVisible
						}
						wrapper={(children) => (
							<Coachmark
								coachmark={
									INSIGHTS_ONBOARDING_CUSTOMIZE_REPORT_VIEW_BY_COACHMARK
								}
							>
								{children}
							</Coachmark>
						)}
					>
						<Icon icon="triangle-down" size="s" />
					</ConditionalWrapper>
				</Button>
			</Popover>
		</div>
	);
};

export default ChartFilter;
