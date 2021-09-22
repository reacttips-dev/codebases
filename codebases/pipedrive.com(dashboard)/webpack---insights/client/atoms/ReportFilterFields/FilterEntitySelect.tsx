import React from 'react';
import { Deal, Organization, Person } from '@pipedrive/form-fields';
import { types as insightsTypes } from '@pipedrive/insights-core';

import { FilterTypenameType, FilterType } from '../../utils/constants';
import ProductMultiSelect from './ProductMultiSelect';
import useSettingsApi from '../../hooks/useSettingsApi';
import { RelatedObjects } from '../../types/apollo-query-types';
import { findRelatedObject } from '../../utils/relatedObjectsHelpers';

import styles from './ReportFilterFields.pcss';

interface FilterEntitySelectProps {
	operand: insightsTypes.Operand;
	onFilterChange: (filter: insightsTypes.Filter) => void;
	canSeeCurrentReport: boolean;
	filterType: FilterType;
}

const FilterEntitySelect = ({
	operand,
	onFilterChange,
	canSeeCurrentReport,
	filterType,
}: FilterEntitySelectProps) => {
	const { addNewRelatedObjects } = useSettingsApi();

	const changeFilter = (suggestion: Pipedrive.Entity) => {
		onFilterChange({
			operands: [
				{
					name: operand.name,
					defaultValue: suggestion.id,
					__typename: FilterTypenameType.SELECTED_OPERAND,
				},
			],
		});
	};

	const isNewRelatedObject = (
		suggestion: Pipedrive.Entity,
		type: keyof RelatedObjects,
	) => suggestion.id && !findRelatedObject(suggestion.id, type);

	const addNewRelatedObjectToCache = (
		suggestion: Pipedrive.Person | Pipedrive.Organization,
		type: keyof RelatedObjects,
	) => {
		if (isNewRelatedObject(suggestion, type)) {
			addNewRelatedObjects(type, [
				{
					id: suggestion.id,
					name: suggestion.name,
				},
			]);
		}
	};

	const formFieldsComponentProps = {
		disabled: !canSeeCurrentReport,
		disableNewLabel: true,
		allowNewItem: false,
	};

	if (filterType === FilterType.DEAL) {
		const relatedObject = findRelatedObject(operand.defaultValue, 'deals');

		return (
			<div className={styles.select} data-test="filter-deal_id-search">
				<Deal
					{...formFieldsComponentProps}
					key={relatedObject?.id || 0}
					onComponentChange={(suggestion: Pipedrive.Deal) => {
						changeFilter(suggestion);

						if (isNewRelatedObject(suggestion, 'deals')) {
							addNewRelatedObjects('deals', [
								{
									id: suggestion.id,
									title: suggestion.title,
								},
							]);
						}
					}}
					value={relatedObject}
				/>
			</div>
		);
	}

	if (filterType === FilterType.ORGANIZATION) {
		const relatedObject = findRelatedObject(
			operand.defaultValue,
			'organizations',
		);

		return (
			<div className={styles.select} data-test="filter-org_id-search">
				<Organization
					{...formFieldsComponentProps}
					key={relatedObject?.id || 0}
					onComponentChange={(suggestion: Pipedrive.Organization) => {
						changeFilter(suggestion);
						addNewRelatedObjectToCache(suggestion, 'organizations');
					}}
					value={relatedObject}
				/>
			</div>
		);
	}

	if (
		filterType === FilterType.PERSON ||
		filterType === FilterType.PARTICIPANTS
	) {
		const relatedObject = findRelatedObject(
			operand.defaultValue,
			'persons',
		);

		return (
			<div className={styles.select} data-test="filter-person_id-search">
				<Person
					{...formFieldsComponentProps}
					key={relatedObject?.id || 0}
					onComponentChange={async (suggestion: Pipedrive.Person) => {
						changeFilter(suggestion);
						addNewRelatedObjectToCache(suggestion, 'persons');
					}}
					value={relatedObject}
				/>
			</div>
		);
	}

	if (filterType === FilterType.PRODUCT) {
		return (
			<div className={styles.select} data-test="filter-product_id-search">
				<ProductMultiSelect
					{...formFieldsComponentProps}
					operandName={operand.name}
					defaultValue={operand.defaultValue}
					onComponentChange={(productIds: number[] | number) => {
						onFilterChange({
							operands: [
								{
									name: operand.name,
									defaultValue: productIds,
									__typename:
										FilterTypenameType.SELECTED_OPERAND,
								},
							],
						});
					}}
				/>
			</div>
		);
	}

	return null;
};

export default FilterEntitySelect;
