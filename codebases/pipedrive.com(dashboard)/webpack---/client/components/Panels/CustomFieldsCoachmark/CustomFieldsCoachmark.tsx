import { Message, Text } from '@pipedrive/convention-ui-react';
import { useCoachmark } from '@pipedrive/use-coachmark';
import { ModalContext } from 'components/AddModal/AddModal.context';
import { CUSTOM_FIELDS_COACHMARK_TAG } from 'components/AddModal/AddModal.utils';
import React, { useContext } from 'react';
import striptags from 'striptags';

export const CustomFieldsCoachmark: React.FC = () => {
	const coachmark = useCoachmark(CUSTOM_FIELDS_COACHMARK_TAG);
	const { translator, isAdmin, modalConfig } = useContext(ModalContext);

	if (!(isAdmin && coachmark.visible && modalConfig.customFieldsSettingsUrl)) {
		return null;
	}

	const customFieldsSettingsUrl = striptags(modalConfig.customFieldsSettingsUrl);

	const firstSentence = translator.gettext('%sCustomise form fields %sin Settings.%s%s ', [
		`<strong>`,
		`<a href="${customFieldsSettingsUrl}" target="_blank">`,
		'</a>',
		'</strong>',
	]);

	const secondSentence = striptags(modalConfig.customFieldsCoachmarkText || '');

	const onClose = React.useCallback(() => {
		coachmark.close();
	}, []);

	return (
		<Message visible alternative onClose={onClose}>
			<Text
				dangerouslySetInnerHTML={{
					__html: firstSentence + secondSentence,
				}}
			/>
		</Message>
	);
};
