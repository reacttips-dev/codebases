import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import SVG from 'react-inlinesvg';
import colors from '@pipedrive/convention-ui-css/dist/amd/colors.js';
import { useTranslator } from '@pipedrive/react-utils';
import { Tooltip, Icon } from '@pipedrive/convention-ui-react';
import { NavBarItem } from './menu/NavBarItem';
import useUserDataContext from '../hooks/useUserDataContext';
import useToolsContext from '../hooks/useToolsContext';
import marketplaceIconSvg from '../assets/marketplace.svg';

const Spacer = styled.div`
	display: flex;
	flex: 1;
`;

const TooltipWrapper = styled.div`
	display: flex;
	margin-bottom: -4px;
`;

const RedirectIconWrapper = styled.div`
	margin-left: 6px;
`;

const IconWrapper = styled.div`
	svg {
		fill: ${colors['$color-black-hex-16']};
	}
	&:hover {
		svg {
			fill: ${colors['$color-white-hex']};
		}
	}
`;

const MarketplaceIcon = styled(SVG)``;

const showTabCoachMark = (iamClient, translator, hoverBarRef) => {
	return new iamClient.Coachmark({
		tag: 'gravity_marketplace_in_navigation',
		parent: hoverBarRef.current,
		content: translator.gettext('Discover pre-built apps and integrations that enhance your sales process'),
		appearance: {
			placement: 'right',
		},
		detached: true,
	});
};

export const MarketplaceButton = () => {
	const { user } = useUserDataContext();
	const { iamClient } = useToolsContext();
	const translator = useTranslator();
	const hoverBarRef = useRef();
	const [coachmark, setCoachmark] = useState(null);

	useEffect(() => {
		if (!coachmark && hoverBarRef.current && iamClient) {
			setCoachmark(showTabCoachMark(iamClient, translator, hoverBarRef));
		}
	}, [hoverBarRef, iamClient]);

	const handleTabClick = () => {
		if (coachmark) {
			coachmark.close();

			setCoachmark(null);
		}
	};

	const isFeatureFlagEnabled = user?.companyFeatures.get('marketplace_in_navigation');

	if (!isFeatureFlagEnabled) {
		return null;
	}

	const marketplaceText = translator.gettext('Marketplace');

	return (
		<>
			<Spacer />
			<div ref={hoverBarRef} onClick={handleTabClick}>
				<Tooltip
					placement="right"
					content={
						<TooltipWrapper>
							{marketplaceText}
							<RedirectIconWrapper>
								<Icon color="white" icon="redirect" size="s" />
							</RedirectIconWrapper>
						</TooltipWrapper>
					}
				>
					<div>
						<IconWrapper>
							<NavBarItem
								className="marketplace"
								href="https://www.pipedrive.com/en/marketplace"
								rel="noopener"
								target="_blank"
							>
								<MarketplaceIcon src={marketplaceIconSvg} />
							</NavBarItem>
						</IconWrapper>
					</div>
				</Tooltip>
			</div>
		</>
	);
};
