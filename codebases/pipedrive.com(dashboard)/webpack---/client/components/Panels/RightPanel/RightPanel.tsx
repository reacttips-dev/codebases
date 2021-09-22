import { Separator, Spacing } from '@pipedrive/convention-ui-react';
import classNames from 'classnames';
import { ModalContext } from 'components/AddModal/AddModal.context';
import { getOrgFieldKey, getPersonFieldKey } from 'components/Fields/Fields.utils';
import FormField from 'components/Fields/FormField';
import VisibilityField from 'components/Fields/VisibilityField';
import ProductsForm from 'components/Products/ProductsForm';
import React, { useContext } from 'react';
import { Field, ModalUpdateState, RelatedEntityFields } from 'Types/types';

import styles from './RightPanel.pcss';

interface RightPanelProps {
	relatedEntityFields: RelatedEntityFields;
}

export function RightPanel({ relatedEntityFields }: RightPanelProps) {
	const {
		modalState,
		settings,
		translator,
		isAddingProducts,
		relatedEntityState,
		onUpdateRelatedEntityState,
		modalType,
	} = useContext(ModalContext);

	const hasFields = relatedEntityFields.hasFields || isAddingProducts;
	const hasPersonFields = relatedEntityFields.person && relatedEntityFields.person.length > 0;
	const hasOrganizationFields = relatedEntityFields.organization && relatedEntityFields.organization.length > 0;
	const productsSectionRef = React.useRef<null | HTMLDivElement>(null);

	React.useEffect(() => {
		if (isAddingProducts && productsSectionRef && productsSectionRef.current) {
			setTimeout(() => {
				(productsSectionRef.current as HTMLDivElement).scrollIntoView({
					behavior: 'smooth',
				});
			}, 100);
		}
	}, [isAddingProducts]);

	const renderFields = (type: 'person' | 'organization') => {
		const onUpdateState = (newValue: ModalUpdateState) => onUpdateRelatedEntityState(newValue, type);
		const typeToKeyMap = {
			organization: getOrgFieldKey(modalType),
			person: getPersonFieldKey(modalType),
		};

		const fieldKey = typeToKeyMap[type];
		const areFieldsEditable = (modalState[fieldKey] && modalState[fieldKey].isNew) || false;

		return (
			<div>
				<div
					className={styles.iconFieldsWrapper}
					data-test={`right-panel-section-${type}`}
					data-test-disabled={!areFieldsEditable}
				>
					<Separator className={styles.separator} icon={type}>
						{type === 'person' ? translator.gettext('PERSON') : translator.gettext('ORGANIZATION')}
					</Separator>
					<div className={styles.fields}>
						{(relatedEntityFields[type] || []).map((field: Field) => {
							return renderFormField(field, type, areFieldsEditable, onUpdateState);
						})}
					</div>
				</div>
			</div>
		);
	};

	const renderFormField = (
		field: Field,
		type: 'person' | 'organization',
		areFieldsEditable: boolean,
		onUpdateState: (newValue: ModalUpdateState) => void,
	) => {
		const stateValue = relatedEntityState.organization ? relatedEntityState[type][field.key] : null;

		return (
			<div className={styles.formField}>
				{field.key === 'visible_to' ? (
					<VisibilityField
						initialValue={settings[type === 'person' ? 'personDefaultVisibility' : 'orgDefaultVisibility']}
						disabled={!areFieldsEditable}
						onUpdateState={onUpdateState}
					/>
				) : (
					<FormField
						type={type}
						field={field}
						disabled={!areFieldsEditable}
						value={stateValue ? stateValue.value : null}
						onUpdateState={onUpdateState}
					/>
				)}
			</div>
		);
	};

	if (!hasFields) {
		return null;
	}

	return (
		<Spacing
			className={classNames({
				[styles.panel]: true,
				[styles.extendedPanel]: isAddingProducts,
			})}
			all="m"
			data-test="right-panel"
		>
			{hasPersonFields && renderFields('person')}
			{hasOrganizationFields && renderFields('organization')}
			{isAddingProducts && (
				<div>
					<Separator className={styles.separator} icon="product" forwardRef={productsSectionRef}>
						{translator.gettext('PRODUCTS')}
					</Separator>
					<ProductsForm />
				</div>
			)}
		</Spacing>
	);
}
