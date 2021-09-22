import { Icon, Popover, Spinner } from '@pipedrive/convention-ui-react';
import { mapFieldType } from '@pipedrive/form-fields';
import awesomeDebouncePromise from 'awesome-debounce-promise';
import { ModalContext } from 'components/AddModal/AddModal.context';
import React, { useContext, useState } from 'react';
import { searchDuplicates } from 'utils/api/api';
import { FormFieldsOnChange, ModalType, SearchParams } from 'Types/types';

import { DuplicatesList } from './Duplicates.list';
import styles from './Duplicates.pcss';
import {
	getActiveBlockName,
	getSearchParams,
	isFirstKeyInObject,
	isLengthCorrect,
	isSearchTermsDefined,
} from './Duplicates.utils';

export interface DuplicatesProps {
	Element: React.FunctionComponent<any>;
	type: ModalType;
	onComponentChange: (params: FormFieldsOnChange) => void;
	fieldKey: string;
}

const searchDuplicatesDebounced = awesomeDebouncePromise(searchDuplicates, 350);

export const Duplicates: React.FC<DuplicatesProps> = ({ Element, type, onComponentChange, fieldKey, ...restProps }) => {
	const {
		duplicates,
		setActiveDuplicateBlock,
		duplicateKeyToShow,
		modalState,
		setDuplicates,
		isAutomaticallyOpeningDuplicateChecker,
		logger,
		modalType,
		prefill,
		onUpdateState,
		onResetRelatedEntityState,
	} = useContext(ModalContext);

	const [isLoading, setLoading] = useState(false);
	const [searchParamsState, setSearchParams] = useState<SearchParams>({});

	const togglePopover = () => {
		if (duplicateKeyToShow === fieldKey) {
			setActiveDuplicateBlock('');
		} else {
			setActiveDuplicateBlock(fieldKey);
		}
	};

	const getActionIcon = () => {
		if (!searchParamsState[fieldKey]) {
			return null;
		}

		if (duplicates.length && !isLoading) {
			return (
				<Icon
					onClick={togglePopover}
					className={styles.warning}
					icon="warning-outline"
					color="yellow"
					size="s"
				/>
			);
		}

		if (isLoading) {
			return <Spinner size="s" className={styles.spinner} />;
		}
	};

	const checkDuplicates = async (searchParams: SearchParams) => {
		setLoading(true);

		try {
			const duplicatesList = await searchDuplicatesDebounced(searchParams, type);

			setDuplicates(duplicatesList);
			setLoading(false);

			if (duplicatesList.length && isAutomaticallyOpeningDuplicateChecker) {
				const activeDuplicateBlock = getActiveBlockName(fieldKey, searchParams);

				setActiveDuplicateBlock(activeDuplicateBlock);
			} else {
				setActiveDuplicateBlock('');
			}
		} catch (error) {
			setActiveDuplicateBlock('');
			setDuplicates([]);
			setLoading(false);

			logger.error('Error searching duplicates', error as Error);
		}
	};

	const onDuplicateFieldUpdate = async (changedValue: FormFieldsOnChange) => {
		// If field email/phone has changed, and change was not on primary one, then no need to perform duplicate check
		if ((fieldKey === 'email' || fieldKey === 'phone') && !changedValue[0].changed) {
			onComponentChange(changedValue);

			return;
		}

		const searchParams = getSearchParams(modalState, changedValue, fieldKey);

		setActiveDuplicateBlock(''); // Hide current opened duplicate block
		setSearchParams(searchParams);
		onComponentChange(changedValue);

		if (isSearchTermsDefined(searchParams) && isLengthCorrect(changedValue)) {
			checkDuplicates(searchParams);
		}
	};

	const pickContact = (contact: { id: number; name: string }) => {
		const key = type === 'person' ? 'person_id' : 'org_id';

		// @ts-ignore
		const fieldType = mapFieldType(key, type);

		onUpdateState({
			key,
			value: contact,
			type: fieldType,
			isNew: false,
		});

		onResetRelatedEntityState(key);
		setActiveDuplicateBlock('');
	};

	// Loads duplicate data on initial render for only 1 field. It will be the field that
	// is first in the prefill object and that is one of the duplicate fields.
	// Even if multiple duplicate fields are pre-filled, only 1 request will be made!
	React.useEffect(() => {
		if (!prefill[fieldKey]) {
			return;
		}

		if (isFirstKeyInObject(prefill, fieldKey)) {
			onDuplicateFieldUpdate(prefill[fieldKey]);
		}
	}, []);

	return (
		<div className={styles.popoverWrap}>
			<Popover
				visible={duplicateKeyToShow === fieldKey}
				className={styles.popover}
				placement="right-start"
				portalTo={window.document.body}
				spacing="none"
				content={
					<DuplicatesList
						type={type}
						togglePopover={togglePopover}
						searchParams={searchParamsState}
						allowPick={type !== modalType}
						pickContact={pickContact}
					/>
				}
			>
				<div>
					<Element actionIcon={getActionIcon()} onComponentChange={onDuplicateFieldUpdate} {...restProps} />
				</div>
			</Popover>
		</div>
	);
};
