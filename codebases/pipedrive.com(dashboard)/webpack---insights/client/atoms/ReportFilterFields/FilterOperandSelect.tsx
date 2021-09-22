import React, { useMemo } from 'react';
import { Select } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';

import { getOperandsTranslations } from '../../utils/labels/staticLabels';
import { disabledOperandsByType, FilterType } from '../../utils/constants';

import styles from './ReportFilterFields.pcss';

interface FilterOperandSelectProps {
	reportType: insightsTypes.ReportType;
	operands: string[];
	currentOperand: insightsTypes.Operand;
	operandChanged: (value: string) => void;
	filterType: FilterType;
	canSeeCurrentReport: boolean;
	hasUnavailableOptions: boolean;
}

const FilterOperandSelect: React.FC<FilterOperandSelectProps> = ({
	operands,
	currentOperand,
	operandChanged,
	filterType,
	canSeeCurrentReport,
	reportType,
	hasUnavailableOptions,
}) => {
	const translator = useTranslator();

	const getDisabledOperand = () => {
		if (
			reportType === insightsTypes.ReportType.DEALS_FUNNEL_CONVERSION &&
			filterType === FilterType.PIPELINE
		) {
			return {
				type: FilterType.PIPELINE,
				fallbackValue: insightsTypes.OperandType.EQ,
			};
		}

		if (
			reportType ===
				insightsTypes.ReportType.DEALS_RECURRING_REVENUE_MOVEMENT &&
			filterType === FilterType.PAYMENTS
		) {
			return {
				type: FilterType.PAYMENTS,
				fallbackValue: insightsTypes.OperandType.EQ,
			};
		}

		return disabledOperandsByType.find(
			(operand) => operand.type === filterType,
		);
	};

	const disabledOperand = getDisabledOperand();
	const translatedOperandLabels = useMemo(
		() => getOperandsTranslations(translator),
		[],
	);

	const removeOperand = (operandToBeRemoved: string) => {
		const index = operands.indexOf(operandToBeRemoved);

		if (index > -1) {
			operands.splice(index, 1);
		}
	};

	// Temporary - until component with multiple people is available in form fields
	if (
		[
			FilterType.PERSON,
			FilterType.ORGANIZATION,
			FilterType.DEAL,
			FilterType.PARTICIPANTS,
		].includes(filterType)
	) {
		removeOperand('isAnyOf');
	}

	if (hasUnavailableOptions) {
		removeOperand('isNotAnyOf');
	}

	const additionalSelectProps = disabledOperand
		? {
				placeholder:
					translatedOperandLabels[disabledOperand.fallbackValue],
		  }
		: null;

	return (
		<Select
			className={styles.select}
			popupClassName={styles.options}
			onChange={(value: string) => {
				if (currentOperand.name !== value) {
					operandChanged(value);
				}
			}}
			value={currentOperand && !disabledOperand && currentOperand.name}
			disabled={!!disabledOperand || !canSeeCurrentReport}
			portalTo={document.body}
			popperProps={{
				modifiers: {
					preventOverflow: { enabled: false },
				},
			}}
			data-test="filter-operand-select"
			{...additionalSelectProps}
		>
			{operands &&
				!disabledOperand &&
				operands.map((operand, key) => {
					return (
						<Select.Option
							value={operand}
							key={String(key)}
							data-test={`operand-select-option-${operand}`}
						>
							{translatedOperandLabels[operand]}
						</Select.Option>
					);
				})}
		</Select>
	);
};

export default FilterOperandSelect;
