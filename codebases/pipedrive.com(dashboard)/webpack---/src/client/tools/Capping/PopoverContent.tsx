import React from 'react';
import { Spinner, Button, PopoverPlacement } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import {
	Title,
	SubTitle,
	ReportsUsedContainer,
	PercentageRead,
	SubText,
	UpgradeButtonContainer,
	StyledProgressbar,
	CenteredContent,
} from './upgradePopoverStyled';
import { BillableActions, NonBillableActions } from './PopoverBillingActions';
import { useUpgradeTranslations } from './utils/useUpgradeTranslations';
import capitalize from 'lodash/capitalize';
import { LimitType, TierCode } from './types';

export interface PopoverContentProps {
	limitType: LimitType;
	tierCode: TierCode;
	tierLimit: number;
	nextTierLimit: number;
	canBill: boolean;
	numberOfItems: number;
	isReseller: boolean;
	onCloseErrorClick: (e: any) => void;
	placement?: PopoverPlacement;
	loading?: boolean;
	error?: boolean;
	portalTo?: HTMLElement;
}

const USAGE_OVERVIEW_URL = '/settings/usage-caps/overview';
const SUBSCRIPTION_CHANGE_URL = '/settings/subscription/change?cap=true';

function getProgressbarColor(numberOfItems: number, tierLimit: number) {
	const percentage = (numberOfItems / tierLimit) * 100;
	const percentageWithOneMoreItem = ((numberOfItems + 1) / tierLimit) * 100;

	if (percentageWithOneMoreItem >= 80 && percentage < 100) {
		return 'yellow';
	}
	if (percentage < 80) {
		// eslint-disable-next-line no-undefined
		return undefined;
	}
	return 'red';
}

export function PopoverContent({
	limitType,
	tierCode,
	tierLimit,
	nextTierLimit,
	canBill,
	numberOfItems,
	isReseller,
	error,
	loading,
	onCloseErrorClick,
}: PopoverContentProps) {
	const translator = useTranslator();
	const translations = useUpgradeTranslations({
		tierCode,
		tierLimit,
		nextTierLimit,
		canBill,
		numberOfItems,
		limitType,
		isReseller,
	});
	const capitalizedTitle = capitalize(translations.title);
	const progressBarColor = getProgressbarColor(numberOfItems, tierLimit);

	const redirectCurrentUsage = () => {
		window.open(USAGE_OVERVIEW_URL, '_blank');
	};

	const redirectUpgradeNow = () => {
		window.open(SUBSCRIPTION_CHANGE_URL, '_blank');
	};

	if (loading) {
		return <Spinner />;
	}

	if (error) {
		return (
			<CenteredContent>
				{translator.gettext('Something went wrong. Please try again.')}
				<Button size="s" onClick={(event) => onCloseErrorClick(event)}>
					{translator.gettext('Close')}
				</Button>
			</CenteredContent>
		);
	}

	return (
		<>
			<Title>{capitalizedTitle}</Title>
			<ReportsUsedContainer>
				<SubTitle>{translations.subTitle} </SubTitle>
				<PercentageRead>{translations.roundedPercentage}%</PercentageRead>
			</ReportsUsedContainer>
			<StyledProgressbar percent={translations.roundedPercentage} color={progressBarColor} />
			<SubText>{translations.subText} </SubText>
			<UpgradeButtonContainer>
				{canBill ? (
					<BillableActions
						onUpgradeClick={() => redirectUpgradeNow()}
						onViewClick={() => redirectCurrentUsage()}
						buttonTexts={translations.buttonTranslator}
					/>
				) : (
					<NonBillableActions
						onViewClick={() => redirectCurrentUsage()}
						buttonTexts={translations.buttonTranslator}
					/>
				)}
			</UpgradeButtonContainer>
		</>
	);
}
