import React, { useContext } from 'react';
import styled from 'styled-components';
import { useTranslator } from '@pipedrive/react-utils';
import { colors } from '@pipedrive/convention-ui-css/dist/js/variables';
import { Marksome, References } from 'react-marksome';
import { useAddLeadModal } from 'Leadbox/hooks/useAddLeadModal';
import { WebappApiContext } from 'Components/WebappApiContext';
import { useLocalStorage } from 'Hooks/useLocalStorage';
import { LOCAL_STORAGE_KEY_PREFIX, KEY_VISITED } from '@pipedrive/lead-suite-paywall/dist/components';

import { EmptyPageAnimation } from './EmptyPageAnimation';

const EmptyPageAnimationWrapper = styled.div`
	margin-bottom: 20px;
`;

const Wrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	margin-top: 100px;
`;

const SubHeader = styled.h2`
	font-size: 15px;
	line-height: 1.33;
	letter-spacing: normal;
	text-align: center;
	color: ${colors.black64};
`;

const Header = styled.h3`
	font-size: 23px;
	line-height: 1.22;
	color: ${colors.black};
	margin-bottom: 12px;
`;

const StyledLink = styled.a`
	font-weight: 600;
`;

export const EntryPage: React.FC = () => {
	const translator = useTranslator();

	const handleOpenAddModal = useAddLeadModal();
	const {
		permissions: { canUseImport },
	} = useContext(WebappApiContext);

	const [didTryLeadbooster] = useLocalStorage(LOCAL_STORAGE_KEY_PREFIX + KEY_VISITED, false);

	const text = translator.gettext(
		'[Add new lead][addNewLeadLink] or [import][importLeadsLink] your existing leads from spreadsheet.',
	);
	const textNoImport = translator.gettext(
		'[Add new lead][addNewLeadLink] or import your existing leads from spreadsheet.',
	);
	const textLeadboosterNotTried = translator.gettext(
		'Find new business opportunity. [Add new lead][addNewLeadLink] or [try LeadBooster][tryLeadboosterLink].',
	);

	const references: References = {
		addNewLeadLink: function addNewLeadLink(children) {
			return (
				<StyledLink href="#" onClick={handleOpenAddModal}>
					{children}
				</StyledLink>
			);
		},
		importLeadsLink: function importLeadsLink(children) {
			return <StyledLink href="/settings/import">{children}</StyledLink>;
		},
		tryLeadboosterLink: function tryLeadboosterLink(children) {
			return <StyledLink href="/leads/live-chat">{children}</StyledLink>;
		},
	};

	const finalText = () => {
		if (didTryLeadbooster) {
			return canUseImport ? text : textNoImport;
		}

		return textLeadboosterNotTried;
	};

	return (
		<Wrapper>
			<EmptyPageAnimationWrapper>
				<EmptyPageAnimation />
			</EmptyPageAnimationWrapper>
			<Header>{translator.gettext('Take your leads to the next level')}</Header>
			<SubHeader>
				<Marksome text={finalText()} references={references} />
			</SubHeader>
		</Wrapper>
	);
};
