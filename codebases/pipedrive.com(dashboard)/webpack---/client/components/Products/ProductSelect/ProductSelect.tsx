import { Dropmenu, Input, Tooltip } from '@pipedrive/convention-ui-react';
import awesomeDebouncePromise from 'awesome-debounce-promise';
import { ProductSelectContent } from 'components/Products/ProductSelectContent/ProductSelectContent';
import React from 'react';
import { Product } from 'Types/types';
import { searchProducts } from 'utils/api/api';

interface Props {
	product: Product;
	onSelectProduct: (product: Product) => void;
}

const searchProductsDebounced = awesomeDebouncePromise(searchProducts, 500);
const MIN_SEARCH_LENGTH = 2;

export const ProductSelect: React.FC<Props> = ({ product, onSelectProduct }) => {
	const [products, setProducts] = React.useState<Product[]>([]);
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [isDropdownVisible, setIsDropdownVisible] = React.useState<boolean>(false);
	const [showLongProductNameTooltip, setShowLongProductNameTooltip] = React.useState(false);
	const inputRef = React.useRef<HTMLInputElement>(null);

	React.useEffect(() => {
		setShowLongProductNameTooltip(
			inputRef && !!inputRef.current && inputRef.current?.scrollWidth > inputRef.current?.offsetWidth,
		);
	}, [product.name]);

	const onInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const searchValue = event.target.value;

		if (searchValue.length > 0 && searchValue === product.name) {
			setIsDropdownVisible(false);

			return;
		}

		onSelectProduct({ id: 0, name: searchValue });

		if (searchValue.length < MIN_SEARCH_LENGTH) {
			setProducts([]);
			setIsDropdownVisible(false);

			return;
		}

		setIsLoading(true);

		const matchingProducts = await searchProductsDebounced(searchValue);

		setProducts(matchingProducts);
		setIsLoading(false);
		setIsDropdownVisible(true);
	};

	return (
		<Dropmenu
			popoverProps={{
				visible: product.name.length > 0,
				onVisibilityChange: (isVisible: boolean) => {
					if (!isVisible && isDropdownVisible) {
						setIsDropdownVisible(false);
					}
				},
			}}
			content={
				isDropdownVisible ? (
					<ProductSelectContent
						searchValue={product.name}
						products={products}
						setProducts={setProducts}
						setIsDropdownVisible={setIsDropdownVisible}
						onSelectProduct={onSelectProduct}
					/>
				) : (
					false
				)
			}
		>
			<div>
				<Tooltip
					content={product.name}
					placement="top"
					{...(showLongProductNameTooltip ? {} : { visible: false })}
				>
					<Input
						inputRef={inputRef}
						onChange={onInputChange}
						value={product.name}
						data-test="product-input"
						loading={isLoading}
						allowClear
					/>
				</Tooltip>
			</div>
		</Dropmenu>
	);
};
