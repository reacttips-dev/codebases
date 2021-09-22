import { ModalContext } from 'components/AddModal/AddModal.context';
import React, { useContext } from 'react';

import styles from './AddProducts.pcss';

export const AddProducts: React.FC = () => {
	const { translator, isAddingProducts, setIsAddingProducts } = useContext(ModalContext);

	const toggleAddProducts = () => setIsAddingProducts(!isAddingProducts);

	return (
		<div className={styles.addProducts} onClick={toggleAddProducts} data-test="toggle-products">
			{isAddingProducts ? translator.gettext("Don't add products") : translator.gettext('Add products')}
		</div>
	);
};
