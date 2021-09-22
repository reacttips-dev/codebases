import { Input } from '@pipedrive/convention-ui-react';
import MonetaryInput from 'components/MonetaryInput/MonetaryInput';
import ProductSelect from 'components/Products/ProductSelect';
import React from 'react';
import { Product } from 'Types/types';

import styles from './ProductsFormRow.pcss';

interface Props {
	products: Product[];
	index: number;
	onUpdateProduct: (products: Product[]) => void;
}

export const ProductsFormRow: React.FC<Props> = ({ products, index, onUpdateProduct }) => {
	const onSelectProduct = (product: Product) => {
		const clonedProducts = [...products];

		const newProduct: Product = {
			id: product.id,
			name: product.name,
			price: product.price,
			quantity: clonedProducts[index] ? clonedProducts[index].quantity : product.quantity,
		};

		newProduct.amount = (newProduct.price || 0) * (newProduct.quantity || 1);
		clonedProducts[index] = newProduct;

		onUpdateProduct(clonedProducts);
	};

	const setPrice = (price: number) => {
		const clonedProducts = [...products];

		clonedProducts[index].price = price;
		clonedProducts[index].amount = price * (clonedProducts[index].quantity || 1);
		onUpdateProduct(clonedProducts);
	};

	const setQuantity = (quantity: number) => {
		const clonedProducts = [...products];

		clonedProducts[index].quantity = quantity;
		clonedProducts[index].amount = quantity * (clonedProducts[index].price || 0);
		onUpdateProduct(clonedProducts);
	};

	return (
		<div className={styles.row} key={index} data-test={`product-${index}`}>
			<div className={styles.item}>
				<ProductSelect product={products[index]} onSelectProduct={onSelectProduct} />
			</div>
			<div className={styles.price}>
				<MonetaryInput
					step=".01"
					value={String(products[index].price)}
					onChange={setPrice}
					data-test="product-price"
				/>
			</div>
			<div className={styles.quantity}>
				<MonetaryInput
					step="1"
					min="0"
					value={String(products[index].quantity)}
					onChange={setQuantity}
					data-test="product-quantity"
				/>
			</div>
			<div className={styles.amount}>
				<Input disabled={true} value={String(products[index].amount || 0)} />
			</div>
		</div>
	);
};
