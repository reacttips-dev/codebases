import { Select } from '@pipedrive/convention-ui-react';
import { post } from '@pipedrive/fetch';
import { ModalContext } from 'components/AddModal/AddModal.context';
import React, { useContext } from 'react';
import { Product, ProductPrice } from 'Types/types';

import styles from './ProductSelectContent.pcss';

interface Props {
	searchValue: string;
	products: Product[];
	setProducts: (products: Product[]) => void;
	setIsDropdownVisible: (isVisible: boolean) => void;
	onSelectProduct: (product: Product) => void;
}

export const ProductSelectContent: React.FC<Props> = ({
	searchValue,
	products,
	setProducts,
	setIsDropdownVisible,
	onSelectProduct,
}) => {
	const { translator, modalState, settings } = useContext(ModalContext);

	const addProduct = async (event) => {
		event.preventDefault();
		event.stopPropagation();

		const { data: createdProduct } = await post(`/api/v1/products`, {
			name: searchValue,
		});

		const product = {
			id: createdProduct.id,
			name: createdProduct.name,
		};

		onSelectProduct(product);
		setProducts([]);
		setIsDropdownVisible(false);
	};

	return (
		<div className={styles.productOptions} data-test="product-options">
			{products && products.length > 0 ? (
				products.map((product) => {
					const onClick = () => {
						setProducts([]);
						setIsDropdownVisible(false);

						const selectedCurrency =
							modalState.value && modalState.value.value
								? (modalState.value.value as unknown as { label: string }).label
								: settings.defaultCurrency;

						const matchingProductUnitPrice = (product.prices || []).find(
							(productUnitPrice: ProductPrice) => {
								return productUnitPrice.currency === selectedCurrency;
							},
						);

						product.price = matchingProductUnitPrice?.price;

						onSelectProduct(product);
					};

					return (
						<Select.Option
							data-test="product-option"
							key={product.id}
							className={styles.option}
							onClick={onClick}
						>
							{product.name}
						</Select.Option>
					);
				})
			) : (
				<Select.Option value={null} className={styles.option} onClick={addProduct} data-test="new-product">
					{translator.gettext("'%s' will be added as a new product", searchValue)}
				</Select.Option>
			)}
		</div>
	);
};
