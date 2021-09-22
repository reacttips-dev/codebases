import React from 'react';
import { UpgradeButtonIcon, StyledLink, RedirectIcon, PrimaryButton, SecondaryButton } from './upgradePopoverStyled';

interface Props {
	buttonTexts: { translatedUsageButton: string; translatedLearnButton: string; translatedUpgradeButton: string };
	onUpgradeClick?: () => void;
	onViewClick: () => void;
}

export function BillableActions({ buttonTexts, onUpgradeClick, onViewClick }: Props) {
	return (
		<>
			<PrimaryButton size="s" color="green" onClick={() => onUpgradeClick?.()}>
				<UpgradeButtonIcon icon="upgrade" />
				{buttonTexts.translatedUpgradeButton}
			</PrimaryButton>
			<SecondaryButton onClick={() => onViewClick()} size="s">
				{buttonTexts.translatedUsageButton}
			</SecondaryButton>
		</>
	);
}

export function NonBillableActions({ buttonTexts, onViewClick }: Props) {
	return (
		<>
			<PrimaryButton size="s" onClick={() => onViewClick()}>
				{buttonTexts.translatedUsageButton}
			</PrimaryButton>
			<StyledLink
				href="https://support.pipedrive.com/en/article/usage-limits-in-pipedrive"
				target="_blank"
				rel="noopener noreferrer"
			>
				<span>{buttonTexts.translatedLearnButton}</span>
				<RedirectIcon icon="redirect" size="s" color="blue" />
			</StyledLink>
		</>
	);
}
