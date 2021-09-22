import React, { useEffect, useRef, useState } from 'react';
import { Icon, Tooltip, Spinner } from '@pipedrive/convention-ui-react';
import { TranslatorContext, useTranslator } from '@pipedrive/react-utils';
import { useTranslations } from './utils/useUpsellTranslations';
import {
	StyledDialog,
	CloseButton,
	CloseButtonIcon,
	Title,
	SubTitle,
	BenefitsSection,
	BenefitsAnimation,
	BenefitsDescription,
	DescriptionTitle,
	DescriptionList,
	DescriptionListItem,
	ComparePlansLink,
	UpgradeButtonContainer,
	FooterText,
	LoadingOrErrorDialog,
	CenteredContent,
	StyledButton,
} from './upsellDialogStyled';
import getTranslator from '@pipedrive/translator-client/fe';
import analyticsAnimationData from './animations/analytics.json';
import automationAnimationData from './animations/automation.json';
import customizationAnimationData from './animations/customization.json';
import growthAnimationData from './animations/growth.json';
import analyticsAnimationSVG from './animations/analytics.svg';
import automationAnimationSVG from './animations/automation.svg';
import customizationAnimationSVG from './animations/customization.svg';
import growthAnimationSVG from './animations/growth.svg';
import lottie from 'lottie-web';
import InlineSVG from 'react-inlinesvg';
import { LimitType, TierCode, NextTier } from './types';
import ErrorBoundary from '../ErrorBoundary';

export interface UpsellDialogProps {
	limitType: LimitType;
	tierCode: TierCode;
	tierLimits: any;
	canBill: boolean;
	visible?: boolean;
	nextTier: NextTier;
	isReseller: boolean;
	onClose: () => void;
	loading?: boolean;
	error?: boolean;
}

export default async function (componentLoader) {
	const user = await componentLoader.load('webapp:user');
	const router = await componentLoader.load('froot:router');
	const translator = await getTranslator('froot', user.getLanguage());
	const componentName = 'froot:cappingDialog';

	const Wrapper = (props: UpsellDialogProps) => {
		return (
			<ErrorBoundary componentName={componentName}>
				<TranslatorContext.Provider value={translator}>
					<UpsellDialog {...props} />
				</TranslatorContext.Provider>
			</ErrorBoundary>
		);
	};

	const UpsellDialog = ({
		limitType,
		tierCode,
		tierLimits,
		canBill,
		visible = true,
		nextTier,
		isReseller,
		onClose,
		loading = false,
		error = false,
	}: UpsellDialogProps) => {
		const translator = useTranslator();
		const translations = useTranslations(tierCode, tierLimits, canBill, limitType, isReseller);
		const typeTranslations = translations[limitType];
		const loadContent = !error && !loading;
		const dialogRef = useRef<any>();

		const renderDismissButton = () => {
			if (!dialogRef.current) {
				return;
			}

			return (
				<Tooltip placement="top" content={translator.gettext('Dismiss')} portalTo={dialogRef.current.el}>
					<CloseButton onClick={onClose} color="ghost-alternative">
						<CloseButtonIcon icon="cross" size="s" />
					</CloseButton>
				</Tooltip>
			);
		};

		if (!loadContent) {
			return (
				<LoadingOrErrorDialog visible={visible} onClose={onClose} actions closeOnEsc>
					{renderDismissButton()}
					{loading && (
						<CenteredContent>
							<Spinner size="l" />
						</CenteredContent>
					)}
					{error && (
						<CenteredContent>
							{translator.gettext('Something went wrong. Please try again.')}
						</CenteredContent>
					)}
				</LoadingOrErrorDialog>
			);
		}

		const redirectCurrentUsage = () => {
			onClose();
			router.navigateTo('/settings/usage-caps/overview');
		};

		const redirectUpgradeNow = () => {
			onClose();
			router.navigateTo('/settings/subscription/change?cap=true');
		};

		const variantAnimationData = {
			gold: { data: automationAnimationData, svg: automationAnimationSVG },
			platinum: { data: analyticsAnimationData, svg: analyticsAnimationSVG },
			diamond: { data: customizationAnimationData, svg: customizationAnimationSVG },
		};

		const growthAnimationContainer = useRef();
		const variantAnimationContainer = useRef();
		const [growthAnimLoaded, setGrowthAnimLoaded] = useState(true);
		const [nextTierAnimLoaded, setNextTierAnimLoaded] = useState(true);

		useEffect(() => {
			const growthAnim = lottie.loadAnimation({
				container: growthAnimationContainer.current,
				renderer: 'svg',
				loop: false,
				autoplay: true,
				animationData: growthAnimationData,
				rendererSettings: {
					progressiveLoad: false,
				},
			});

			growthAnim.addEventListener('data_failed', () => {
				setGrowthAnimLoaded(false);
			});

			const nextTierAnim = lottie.loadAnimation({
				container: variantAnimationContainer.current,
				renderer: 'svg',
				loop: false,
				autoplay: true,
				animationData: variantAnimationData[nextTier].data,
				rendererSettings: {
					progressiveLoad: false,
				},
			});

			nextTierAnim.addEventListener('data_failed', () => {
				setNextTierAnimLoaded(false);
			});
		}, []);

		return (
			<StyledDialog
				ref={dialogRef}
				visible={visible}
				onClose={onClose}
				data-test="upsell-dialog"
				actions
				closeOnEsc
			>
				{renderDismissButton()}
				<Title>{typeTranslations.title}</Title>
				<SubTitle>{translations.subTitle}</SubTitle>
				<BenefitsSection>
					{growthAnimLoaded ? (
						<BenefitsAnimation ref={growthAnimationContainer} />
					) : (
						<InlineSVG src={growthAnimationSVG} />
					)}
					<BenefitsDescription>
						<div>
							<DescriptionTitle>{translator.gettext('Ensure you keep growing!')}</DescriptionTitle>
							<DescriptionList>
								<DescriptionListItem
									dangerouslySetInnerHTML={{ __html: translations.growingPerk1 }}
								></DescriptionListItem>
								<DescriptionListItem
									dangerouslySetInnerHTML={{ __html: translations.growingPerk2 }}
								></DescriptionListItem>
								<DescriptionListItem
									dangerouslySetInnerHTML={{ __html: translations.growingPerk3 }}
								></DescriptionListItem>
							</DescriptionList>
						</div>
					</BenefitsDescription>
				</BenefitsSection>
				<BenefitsSection>
					{nextTierAnimLoaded ? (
						<BenefitsAnimation ref={variantAnimationContainer} />
					) : (
						<InlineSVG src={variantAnimationData[nextTier].svg} />
					)}
					<BenefitsDescription>
						<div>
							<DescriptionTitle>{translations.upgradeTitle}</DescriptionTitle>
							<DescriptionList>
								<DescriptionListItem>{translations.upgradePerk1}</DescriptionListItem>
								<DescriptionListItem>{translations.upgradePerk2}</DescriptionListItem>
								<DescriptionListItem>{translations.upgradePerk3}</DescriptionListItem>
							</DescriptionList>
						</div>
					</BenefitsDescription>
				</BenefitsSection>
				<ComparePlansLink href="https://www.pipedrive.com/en/pricing" target="_blank" rel="noopener noreferrer">
					{translator.gettext('Compare all plans')} <Icon icon="redirect" size="s" />
				</ComparePlansLink>
				<UpgradeButtonContainer>
					{canBill && (
						<StyledButton onClick={() => redirectUpgradeNow()} color="green">
							{translator.gettext('Upgrade now')}
						</StyledButton>
					)}
					<StyledButton onClick={() => redirectCurrentUsage()}>
						{translator.gettext('View your current usage')}
					</StyledButton>
				</UpgradeButtonContainer>
				<FooterText>{translations.footer}</FooterText>
			</StyledDialog>
		);
	};

	return Wrapper;
}
