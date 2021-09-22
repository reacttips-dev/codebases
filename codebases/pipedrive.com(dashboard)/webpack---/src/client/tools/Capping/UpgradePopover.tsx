import React, { useState } from 'react';
import { StyledPopover, InfoIcon, InfoButton, ActiveInfoIcon } from './upgradePopoverStyled';
import { PopoverContent, PopoverContentProps } from './PopoverContent';
import { TranslatorContext } from '@pipedrive/react-utils';
import getTranslator from '@pipedrive/translator-client/fe';
import ErrorBoundary from '../ErrorBoundary';

export default async function (componentLoader) {
	const user = await componentLoader.load('webapp:user');
	const translator = await getTranslator('froot', user.getLanguage());
	const componentName = 'froot:cappingPopover';

	function CustomIcon({ isActive }) {
		if (isActive) {
			return <ActiveInfoIcon icon="info" size="s" />;
		}

		return <InfoIcon icon="info-outline" size="s" />;
	}

	function UpgradePopover({
		limitType,
		tierCode,
		tierLimit,
		nextTierLimit,
		canBill,
		numberOfItems,
		isReseller,
		placement = 'bottom',
		loading = false,
		error = false,
		portalTo = null,
	}: PopoverContentProps) {
		const [isActive, setIsActive] = useState(false);

		const onClickInsidePopover = (e: React.MouseEvent | React.KeyboardEvent) => {
			e.stopPropagation();
			setIsActive(false);
		};

		return (
			<ErrorBoundary componentName={componentName}>
				<TranslatorContext.Provider value={translator}>
					<StyledPopover
						content={
							<PopoverContent
								limitType={limitType}
								tierCode={tierCode}
								tierLimit={tierLimit}
								nextTierLimit={nextTierLimit}
								canBill={canBill}
								numberOfItems={numberOfItems}
								isReseller={isReseller}
								loading={loading}
								error={error}
								onCloseErrorClick={onClickInsidePopover}
							/>
						}
						data-test="upgrade-popover"
						onPopupVisibleChange={() => setIsActive(!isActive)}
						visible={isActive}
						placement={placement}
						portalTo={portalTo}
					>
						<InfoButton size="s" color="ghost-alternative">
							<CustomIcon isActive={isActive} />
						</InfoButton>
					</StyledPopover>
				</TranslatorContext.Provider>
			</ErrorBoundary>
		);
	}

	return UpgradePopover;
}
