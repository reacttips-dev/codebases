import { ModalContext } from 'components/AddModal/AddModal.context';
import ProductsFormRow from 'components/Products/ProductsFormRow';
import rowStyles from 'components/Products/ProductsFormRow/ProductsFormRow.pcss';
import React, { useContext } from 'react';
import { Product } from 'Types/types';

import styles from './ProductsForm.pcss';

const DEFAULT_PRODUCT = { id: 0, name: '', price: 0, quantity: 1, amount: 0 };

export const ProductsForm: React.FC = () => {
	const { translator, modalState, settings, onUpdateRelatedEntityState, onUpdateState } = useContext(ModalContext);
	const [products, setProducts] = React.useState<Product[]>([{ ...DEFAULT_PRODUCT }]);

	const addProductRow = () => {
		setProducts(products.concat([{ ...DEFAULT_PRODUCT }]));
	};

	const onUpdateProduct = (updatedProducts: Product[]) => {
		onUpdateRelatedEntityState(
			{
				key: 'products',
				value: updatedProducts,
				type: 'product',
			},
			'product',
		);

		const currentValue = modalState.value?.value as null | { value: number; label: string };
		const currentValueCurrency = currentValue ? currentValue.label : settings.defaultCurrency;

		onUpdateState({
			key: 'value',
			value: {
				value: updatedProducts.reduce((sum, product) => {
					sum += (product.price || 0) * (product.quantity || 1);

					return sum;
				}, 0),
				label: currentValueCurrency,
			},
			type: 'monetary',
		});

		setProducts(updatedProducts);
	};

	const total = products.reduce((sum, product) => {
		sum += product.amount || 0;

		return sum;
	}, 0);

	return (
		<div className={styles.form} data-test="products-form">
			<div className={rowStyles.row}>
				<div className={rowStyles.item}>{translator.gettext('Item')}</div>
				<div className={rowStyles.price}>{translator.gettext('Price')}</div>
				<div className={rowStyles.quantity}>{translator.gettext('Quantity')}</div>
				<div className={rowStyles.amount}>{translator.gettext('Amount')}</div>
			</div>
			{products.map((product, index) => {
				return (
					<ProductsFormRow key={index} index={index} products={products} onUpdateProduct={onUpdateProduct} />
				);
			})}

			<div className={styles.addOneMore}>
				<span onClick={addProductRow} data-test="products-add-more">
					{translator.gettext('+ add one more')}
				</span>
			</div>

			<div className={styles.total} data-test="total-amount">
				<div className={styles.totalText}>{translator.gettext('Total')}</div>
				<div className={styles.totalValue}>{total}</div>
			</div>
		</div>
	);
};
