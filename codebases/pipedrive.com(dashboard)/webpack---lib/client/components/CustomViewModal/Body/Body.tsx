import React, { useState } from 'react';
import { useTranslator } from '@pipedrive/react-utils';
import { Tooltip } from '@pipedrive/convention-ui-react';
import { Field, ModalStatus } from 'Components/CustomViewModal/types';
import { translateItemType } from 'Components/CustomViewModal/Translator/translateMaps';
import { CustomViewHelper } from 'Components/CustomViewModal/utils/useCustomViewHelper';

import * as S from './Body.styles';

type Props = {
	modalStatus: ModalStatus;
	customViewHelper: CustomViewHelper;
	searchParam: string;
};

export const Body = ({ modalStatus, customViewHelper, searchParam }: Props) => {
	const translator = useTranslator();
	const [currentItemType, setCurrentItemType] = useState(customViewHelper.fieldTypes[0]);

	const hasMultipleItemTypes = customViewHelper.fieldTypes.length > 1;
	const isSearchInputFilled = searchParam.length > 0;
	const searchResults = customViewHelper.searchField(searchParam);

	const availableFields = customViewHelper.availableFields.filter((e) => e.itemType === currentItemType);

	const buildOptions = (params: { fields: Field[]; showItemType: boolean }): React.ReactNode[] => {
		return params.fields.map((field: Field) => {
			return (
				<S.FieldRow key={`${field.itemType}-${field.key}`}>
					<S.FieldCheckbox
						checked={customViewHelper.isFieldSelected(field)}
						disabled={modalStatus !== 'IDLE'}
						onChange={() => customViewHelper.setField(field)}
					>
						{field.isSubfield && field.parent ? `${field.parent.name} → ${field.name}` : field.name}
					</S.FieldCheckbox>
					{params.showItemType && (
						<S.FieldItemType>{translateItemType(translator, field.itemType)}</S.FieldItemType>
					)}
				</S.FieldRow>
			);
		});
	};

	return (
		<S.BodyWrapper>
			{isSearchInputFilled && searchResults.length > 0 && (
				<>
					<S.FilterMatches>
						{translator.ngettext('%s match', '%s matches', searchResults.length, searchResults.length)}
					</S.FilterMatches>

					<S.FilteredList>
						{buildOptions({
							fields: searchResults,
							showItemType: hasMultipleItemTypes,
						})}
					</S.FilteredList>
				</>
			)}

			{isSearchInputFilled && searchResults.length === 0 && (
				<S.EmptyResults>
					<S.EmptyResultsHeading>{translator.gettext('No match found')}</S.EmptyResultsHeading>
					<S.EmptyResultsBody>{translator.gettext('Please check your spelling')}</S.EmptyResultsBody>
				</S.EmptyResults>
			)}

			{!isSearchInputFilled && (
				<>
					<S.Separator type="block">{translator.gettext('Visible')}</S.Separator>

					<S.List>
						{buildOptions({
							fields: customViewHelper.visibleFields,
							showItemType: hasMultipleItemTypes,
						})}
					</S.List>

					<S.Separator type="block">{translator.gettext('Available')}</S.Separator>

					{/* We show the item type selector only when it's relevant (it operates on more than 1 type) */}
					{hasMultipleItemTypes && (
						<S.FieldTypesRow
							tabs={
								<>
									{customViewHelper.fieldTypes.map((type) => (
										<Tooltip
											content={translateItemType(translator, type)}
											placement={'bottom'}
											key={`tab-item-${type}`}
										>
											<S.FieldTypeItem
												active={type === currentItemType}
												onClick={() => setCurrentItemType(type)}
											>
												<S.FieldTypeIcon icon={type} size="s"></S.FieldTypeIcon>
											</S.FieldTypeItem>
										</Tooltip>
									))}
								</>
							}
						/>
					)}

					<S.List>
						{availableFields.length
							? buildOptions({
									fields: availableFields,
									showItemType: false,
							  })
							: translator.gettext('No more fields available')}
					</S.List>
				</>
			)}
		</S.BodyWrapper>
	);
};
