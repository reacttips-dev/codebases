import { Icon, Popover, Spacing } from '@pipedrive/convention-ui-react';
import { EntitySuggestions } from '@pipedrive/form-fields';
import awesomeDebouncePromise from 'awesome-debounce-promise';
import { ModalContext } from 'components/AddModal/AddModal.context';
import { isNewContact } from 'components/AddModal/AddModal.initialState.utils';
import { getOrgFieldKey, getPersonFieldKey } from 'components/Fields/Fields.utils';
import { isContactField } from 'components/Fields/FormField/Form.field.utils';
import { isObject, isString } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { FormFieldsOnChange, ItemType } from 'Types/types';

import styles from './RelatedContactFormField.pcss';
import {
	checkForDuplicates,
	getOrganization,
	getPerson,
	setContactFieldsToRelatedEntityState,
} from './RelatedContactFormField.utils';

type ValueType = string | ItemType[] | number | null;

interface Props {
	fieldKey: string;
	Element: React.FunctionComponent<any>;
	onComponentChange: (params: FormFieldsOnChange, additionaParams?: { isNew?: boolean }) => void;
	value: ValueType;
}

interface ContactSuggestion {
	id: number;
	name: string;
	details?: string;
}

const searchCheckDuplicatesDebounced = awesomeDebouncePromise(checkForDuplicates, 200);

export const RelatedContactFormField: React.FC<Props> = ({
	fieldKey,
	Element,
	onComponentChange,
	value,
	...elementProps
}) => {
	const {
		translator,
		setRelatedEntityState,
		relatedEntityFields,
		onResetRelatedEntityState,
		onUpdateState,
		modalType,
	} = useContext(ModalContext);
	const [duplicates, setDuplicates] = useState<ContactSuggestion[]>([]);
	const [isDuplicatesPopoverVisible, setIsDuplicatesPopoverVisible] = useState(false);

	const personFieldKey = getPersonFieldKey(modalType);
	const orgFieldKey = getOrgFieldKey(modalType);

	useEffect(() => {
		if (!value) {
			return;
		}

		if (isString(value)) {
			fetchDuplicates(value, { force: true });
		} else if (isObject(value)) {
			const contactId = (value as unknown as { id: number }).id;

			if (fieldKey === personFieldKey) {
				setPersonPropertiesToState(contactId);
			} else if (fieldKey === orgFieldKey) {
				setOrganizationPropertiesToState(contactId);
			}
		}
	}, []);

	const onElementComponentChange = async (changedValue: FormFieldsOnChange) => {
		onComponentChange(changedValue);
		onResetRelatedEntityState(fieldKey);

		if (!isNewContact(changedValue)) {
			if (fieldKey === personFieldKey) {
				setPersonPropertiesToState(changedValue.id);
			} else if (fieldKey === orgFieldKey) {
				setOrganizationPropertiesToState(changedValue.id);
			}
		}
	};

	const setPersonPropertiesToState = async (personId: number) => {
		const { person, relatedObjects } = await getPerson(personId);

		setContactFieldsToRelatedEntityState({
			contactType: 'person',
			contact: person,
			setRelatedEntityState,
			relatedEntityFields,
		});

		if (person.org_id) {
			const linkedOrgId = relatedObjects?.organization[person.org_id]?.id;
			const linkedOrgName = relatedObjects?.organization[person.org_id]?.name;

			if (linkedOrgId && linkedOrgName) {
				onUpdateState({
					key: `${orgFieldKey}`,
					value: {
						id: linkedOrgId,
						name: linkedOrgName,
					},
					type: 'organization',
				});

				setOrganizationPropertiesToState(linkedOrgId);
			}
		}
	};

	const setOrganizationPropertiesToState = async (orgId: number) => {
		const organization = await getOrganization(orgId);

		setContactFieldsToRelatedEntityState({
			contactType: 'organization',
			contact: organization,
			setRelatedEntityState,
			relatedEntityFields,
		});
	};

	const fetchDuplicates = async (val: ValueType, { force = false } = {}) => {
		// This ugly force parameter is needed on initial render, because then we need to search for both person and
		// organization duplicates. Without it, the debounce will make it so we search only one of them.
		const duplicatesList = await (force
			? checkForDuplicates(val, fieldKey, modalType)
			: searchCheckDuplicatesDebounced(val, fieldKey, modalType));

		setDuplicates(duplicatesList);
	};

	const onBlur = () => {
		const isContactNew = isContactField(fieldKey) ? { isNew: isNewContact(value) } : {};

		// After item is selected and it is "NEW", then we check for duplicates
		// Unfortunately this is a duplicate duplicates request. Can we get rid of it?
		if (isContactNew) {
			fetchDuplicates(value);
		}

		onComponentChange(value, isContactNew);
	};

	const onVisibilityChange = (isVisible: boolean) => {
		if (isDuplicatesPopoverVisible && !isVisible) {
			setIsDuplicatesPopoverVisible(false);
		}
	};

	const openDuplicatesPopover = () => setIsDuplicatesPopoverVisible(true);

	const renderSuggestionOptions = () => {
		const onClickOption = (contact: ContactSuggestion) => {
			setDuplicates([]);
			setIsDuplicatesPopoverVisible(false);
			onComponentChange(contact);
		};

		const onClickAddNew = () => {
			setDuplicates([]);
			setIsDuplicatesPopoverVisible(false);
		};

		return (
			<Spacing top="s" bottom="s" className={styles.contactSuggestions} data-test="duplicate-suggestions">
				<EntitySuggestions
					items={duplicates}
					type={fieldKey === personFieldKey ? 'person' : 'organization'}
					onClickOption={onClickOption}
					onClickAddNew={onClickAddNew}
					highlightedIndex={null}
					texts={{
						tooltip: translator.gettext('Show organization details'),
						addNew: translator.gettext('Add as new contact'),
					}}
				/>
			</Spacing>
		);
	};

	return (
		<React.Fragment>
			<Popover
				visible={isDuplicatesPopoverVisible}
				content={renderSuggestionOptions()}
				onVisibilityChange={onVisibilityChange}
				spacing="none"
				placement="bottom-start"
				className={styles.popover}
			>
				<div>
					<Element
						onComponentChange={onElementComponentChange}
						value={value}
						onBlur={onBlur}
						{...elementProps}
					/>
					{duplicates.length > 0 && !isDuplicatesPopoverVisible && isNewContact(value) && (
						<div className={styles.duplicatesWarning}>
							<Icon icon="warning-outline" color="yellow" size="s" />
							{fieldKey === personFieldKey
								? translator.gettext('Similar person already exists.')
								: translator.gettext('Similar organization already exists.')}
							<span
								className={styles.reviewLink}
								onClick={openDuplicatesPopover}
								data-test="duplicate-review"
							>
								{translator.gettext('Review')}
							</span>
						</div>
					)}
				</div>
			</Popover>
		</React.Fragment>
	);
};
