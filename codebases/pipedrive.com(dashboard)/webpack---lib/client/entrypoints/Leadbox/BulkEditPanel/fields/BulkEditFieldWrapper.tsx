import React, { useState } from 'react';
import { Select, Tooltip } from '@pipedrive/convention-ui-react';
import { colors } from '@pipedrive/convention-ui-css/dist/js/variables';
import { useTranslator } from '@pipedrive/react-utils';
import styled from 'styled-components';
import { ConditionalWrapper } from 'Utils/conditionalRendering/ConditionalWrapper';

export enum FieldBulkMode {
	Keep = 'Keep',
	Replace = 'Replace',
	Remove = 'Remove',
}

const Wrapper = styled.div`
	padding: 10px 0;
`;

const ChildrenWrapper = styled.div`
	margin-top: 6px;
`;

const Title = styled.div`
	color: ${colors.black64};
`;

const SelectOptionLabel = styled.span<{ readonly bulkMode: FieldBulkMode }>`
	${({ bulkMode }) => bulkMode === FieldBulkMode.Keep && `color: ${colors.black64};`}
`;

const Bullet = styled.div<{ readonly bulkMode: FieldBulkMode }>`
	background-color: ${({ bulkMode }) => {
		return bulkMode === FieldBulkMode.Replace ? colors.green : colors.red;
	}};
	width: 10px;
	height: 10px;
	border-radius: 50%;
	float: left;
	margin-left: -14px;
	margin-top: 5px;
`;

type Props = {
	readonly title: string;
	readonly isMandatory: boolean;
	readonly disabled?: boolean;
	readonly onValueReset: () => void;
	readonly onValueChange: (value: null) => void;
	readonly onEditMode?: () => void;
};

export const BulkEditFieldWrapper: React.FC<Props> = (props) => {
	const { title, isMandatory, children, disabled = false } = props;
	const translator = useTranslator();
	const [selectedBulkMode, setSelectedBulkMode] = useState(FieldBulkMode.Keep);

	const onChangeHandler = (bulkMode: FieldBulkMode) => {
		setSelectedBulkMode(bulkMode);

		// nothing is happening for REPLACE mode
		if (bulkMode === FieldBulkMode.Keep) {
			props.onValueReset();
		} else if (bulkMode === FieldBulkMode.Remove) {
			props.onValueChange(null);
		} else if (bulkMode === FieldBulkMode.Replace) {
			props.onEditMode?.();
		}
	};

	return (
		<Wrapper>
			{selectedBulkMode !== FieldBulkMode.Keep && <Bullet bulkMode={selectedBulkMode} />}
			<Title data-testid="BulkEditFieldWrapperTitle">{title}</Title>
			<ConditionalWrapper
				condition={disabled}
				wrapper={(children) => (
					<Tooltip content={translator.gettext('You do not have permission to change the visibility')}>
						{children}
					</Tooltip>
				)}
			>
				<Select
					data-testid="BulkEditFieldWrapperSelect"
					style={{ width: '100%' }}
					disabled={disabled}
					value={selectedBulkMode}
					onChange={onChangeHandler}
				>
					<Select.Option value={FieldBulkMode.Keep}>
						<SelectOptionLabel bulkMode={selectedBulkMode}>
							{translator.gettext('Keep current value')}
						</SelectOptionLabel>
					</Select.Option>

					<Select.Option value={FieldBulkMode.Replace}>
						<SelectOptionLabel bulkMode={selectedBulkMode}>
							{translator.gettext('Edit current value…')}
						</SelectOptionLabel>
					</Select.Option>

					{!isMandatory && (
						<Select.Option value={FieldBulkMode.Remove}>
							<SelectOptionLabel bulkMode={selectedBulkMode}>
								{translator.gettext('Clear the field')}
							</SelectOptionLabel>
						</Select.Option>
					)}
				</Select>
			</ConditionalWrapper>
			{selectedBulkMode === FieldBulkMode.Replace && <ChildrenWrapper>{children}</ChildrenWrapper>}
		</Wrapper>
	);
};
