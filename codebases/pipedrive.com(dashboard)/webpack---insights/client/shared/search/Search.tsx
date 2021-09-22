import React, { useEffect, useRef } from 'react';
import { Input } from '@pipedrive/convention-ui-react';

import { SidemenuSettings } from '../../types/apollo-query-types';

import styles from './Search.pcss';

interface SearchProps {
	objects?: SidemenuSettings | any;
	array?: any;
	setSearchableObject: any;
	placeholder: string;
	setInProgress?: any;
	setSearchText?: any;
	shouldAutoFocus?: boolean;
}

const Search: React.FC<SearchProps> = ({
	objects,
	array,
	setSearchableObject,
	placeholder,
	setInProgress,
	setSearchText,
	shouldAutoFocus,
}) => {
	const inputElement = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (shouldAutoFocus && inputElement && inputElement.current) {
			inputElement.current.focus();
		}

		if (setInProgress) {
			setInProgress(false);
		}
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const searchTerm = e.target.value.toLowerCase();

		let filterResults;

		if (array) {
			filterResults = array.filter((option: any) =>
				option.label.toLowerCase().includes(searchTerm),
			);
		} else if (objects) {
			filterResults = Object.keys(objects).reduce(
				(acc, key) => ({
					...acc,
					...{
						[key]: objects[key].filter((i: any) =>
							(i?.name || i?.label || '')
								.toLowerCase()
								.includes(searchTerm),
						),
					},
				}),
				{},
			);
		}

		if (setInProgress) {
			setInProgress(searchTerm.length > 0);
		}

		if (setSearchText) {
			setSearchText(searchTerm);
		}

		setSearchableObject(filterResults);
	};

	return (
		<section className={styles.search}>
			<Input
				icon="ac-search"
				iconPosition="left"
				onChange={handleChange}
				placeholder={placeholder}
				inputRef={inputElement}
				allowClear
			/>
		</section>
	);
};

export default Search;
