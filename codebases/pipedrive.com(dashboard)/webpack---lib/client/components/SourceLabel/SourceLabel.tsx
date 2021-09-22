import React from 'react';
import { useTranslator, Translator } from '@pipedrive/react-utils';
import { createFragmentContainer, graphql } from '@pipedrive/relay';
import { SourceIcon } from 'Components/SourceIcon/SourceIcon';

import * as S from './SourceLabel.styles';
import type { SourceLabel_source, LeadSourceIcon } from './__generated__/SourceLabel_source.graphql';

interface Props {
	readonly source: SourceLabel_source | null;
	readonly isInsideSidebar?: boolean;
}

export const getTranslatedSourceName = (sourceIcon: LeadSourceIcon | null, translator: Translator): string | null => {
	if (sourceIcon === null) {
		return translator.gettext('Manually created');
	}
	const translatableMap: Partial<Record<LeadSourceIcon, string>> = {
		LEADBOOSTER: translator.gettext('Chatbot'),
		LIVE_CHAT: translator.gettext('Live Chat'),
		PROSPECTOR: translator.gettext('Prospector'),
		WEB_FORMS: translator.gettext('Web Forms'),
		WEBSITE_VISITORS: translator.gettext('Web Visitors'),
		IMPORT: translator.gettext('Import'),
		DEAL: translator.gettext('Deal'),
		WORKFLOW_AUTOMATION: translator.gettext('Workflow Automation'),
		API: translator.gettext('API'),
		MANUALLY_CREATED: translator.gettext('Manually created'),
	};

	return translatableMap[sourceIcon] ?? null;
};

export const SourceLabelWithoutData: React.FC<Props> = ({ source, isInsideSidebar = false, children }) => {
	const translator = useTranslator();

	return (
		<S.Wrapper>
			<S.IconWrapper>{children ?? <SourceIcon iconName={source?.iconName} />}</S.IconWrapper>
			<S.LabelWrapper data-testid="SourceLabelName" isInsideSidebar={isInsideSidebar}>
				{getTranslatedSourceName(source?.iconName ?? null, translator) ?? source?.name}
			</S.LabelWrapper>
		</S.Wrapper>
	);
};

export const SourceLabel = createFragmentContainer(SourceLabelWithoutData, {
	source: graphql`
		fragment SourceLabel_source on LeadSource {
			name
			iconName
		}
	`,
});
