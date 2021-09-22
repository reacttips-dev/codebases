import React, { useState, useEffect } from 'react';
import { get } from '@pipedrive/fetch';
import { InputMultiSelect } from '@pipedrive/form-fields';
import { types as insightsTypes } from '@pipedrive/insights-core';

import localState from '../../utils/localState';
import useSettingsApi from '../../hooks/useSettingsApi';
import { RelatedObject } from '../../types/apollo-query-types';

import styles from './ReportFilterFields.pcss';

interface SearchResponseObject {
	item: Pipedrive.Product;
	result_score: number;
}

interface SearchResponseData {
	items: SearchResponseObject[];
}

const mapSearchResult = (data: SearchResponseData): Pipedrive.Product[] => {
	const items = data?.items ?? [];

	return items.map((responseObject) => responseObject.item);
};

const searchForProducts = async (
	term: string,
): Promise<Pipedrive.Product[]> => {
	const url = `/v1/itemSearch?term=${term}&item_types=product&fields=name&limit=100`;
	const { data } = await get(url);

	return mapSearchResult(data);
};

const mapProductsToIds = (
	products: Pipedrive.Product[],
	isEqFilter: boolean,
): number[] | number => {
	const productIds = products.map((product) => product.id);

	if (isEqFilter) {
		return productIds[0];
	}

	return productIds;
};

interface ProductMultiSelectProps {
	onComponentChange: (params: any) => any;
	operandName: string;
	defaultValue?: number[] | number;
}

const ProductMultiSelect: React.FC<ProductMultiSelectProps> = ({
	onComponentChange,
	operandName,
	defaultValue,
}) => {
	const { getCurrentUserSettings } = localState();
	const { relatedObjects } = getCurrentUserSettings();
	const { addNewRelatedObjects } = useSettingsApi();
	const [selectedProducts, setSelectedProducts] = useState([]);
	const isEqFilter = operandName === insightsTypes.OperandType.EQ;

	const getProductsByIds = (ids: number[]): RelatedObject[] =>
		relatedObjects?.products?.filter((product) =>
			ids.includes(product.id),
		) ?? [];

	useEffect(() => {
		if (!defaultValue) {
			return;
		}

		const selectedProductIds = Array.isArray(defaultValue)
			? defaultValue
			: [defaultValue];

		if (selectedProductIds.length > 0) {
			const products = getProductsByIds(selectedProductIds);

			setSelectedProducts(products);
		}
	}, []);

	useEffect(() => {
		// since the multiselect used for all kind of operands
		// we trigger change on operand type change (is, isAnyOf, isNotAnyOf)
		if (selectedProducts.length > 0) {
			if (isEqFilter) {
				// only 1 product should be selected for EQ filter
				setSelectedProducts(selectedProducts.slice(0, 1));
			}

			onComponentChange(mapProductsToIds(selectedProducts, isEqFilter));
		}
	}, [operandName]);

	const addNewProductsToRelatedObjects = (
		addedProducts: Pipedrive.Product[],
	) => {
		const newProducts = addedProducts
			.filter(
				(product) =>
					!relatedObjects?.products?.some(
						(relatedObject) => relatedObject.id === product.id,
					),
			)
			.map((product) => ({
				id: product.id,
				name: product.name,
			}));

		addNewRelatedObjects('products', newProducts);
	};

	return (
		<div className={styles.multiSelect}>
			<InputMultiSelect
				getSuggestionValue={(product: Pipedrive.Product) =>
					product.name
				}
				value={selectedProducts}
				suggestionValueKey="name"
				getSuggestions={searchForProducts}
				dropdownTrigger={2}
				inputProps={{
					icon: 'product',
					allowClear: false,
				}}
				onComponentChange={(addedProducts: Pipedrive.Product[]) => {
					onComponentChange(
						mapProductsToIds(addedProducts, isEqFilter),
					);
					setSelectedProducts(addedProducts);
					addNewProductsToRelatedObjects(addedProducts);
				}}
				allowNewItems={false}
				maxSelectedItems={isEqFilter ? 1 : null}
			/>
		</div>
	);
};

export default ProductMultiSelect;
