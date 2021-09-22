import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Select, Icon } from '@pipedrive/convention-ui-react';
import fonts from '@pipedrive/convention-ui-css/dist/amd/fonts.js';
import colors from '@pipedrive/convention-ui-css/dist/amd/colors.js';
import { MergeFieldsPlugin, InlineImagesPlugin } from '@pipedrive/pd-wysiwyg';
import { useTranslator } from 'utils/translator/translator-hook';
import { apiGetTemplate, apiGetTemplates, apiGetFiles } from 'api';
import TemplatePicker from './template-picker';
import { getCookieValue } from '@pipedrive/fetch';
import { APIContext } from 'shared/contexts';
import { getSortedMailTemplates } from '../../../shared/helpers/mail-templates';
import { getFilteredFilesByTemplateId } from 'shared/helpers/files';
import useStore from '../../store';
import { replaceTemplateAttachments } from '../../actions/attachments';
import escapeText from 'lodash/escape';

const Container = styled.div`
	flex: 0 0 auto;
	height: 64px;
	display: grid;
	grid-template-columns: repeat(2, calc(50% - 8px));
	grid-gap: 8px 16px;
	margin-bottom: 16px;
`;
const Label = styled.div`
	font: ${fonts['$font-title-l']};
`;
const SharedOption = styled.div`
	width: 344px;
	display: grid;
	grid-column-gap: 16px;
	grid-template-columns: repeat(2, auto);
	align-items: center;

	:not(.cui4-option--selected) & {
		margin-right: 24px;
	}
`;
const SharedOptionsIcon = styled(Icon)`
	grid-row: 1 / span 2;
`;
const SharedOptionsTitle = styled.span`
	font: ${fonts['$font-body']};
`;
const SharedOptionsDescription = styled.p`
	font: ${fonts['$font-body-s']};
	color: ${colors['$color-black-hex-64']};

	.cui4-option--highlighted & {
		color: ${colors['$color-white-hex']};
	}
`;

const insertTemplate = async ({
	id,
	language,
	subjectEditor,
	wysiwyg,
	replaceTemplateAttachments,
	setComposerData
}) => {
	const [{ data: template }, { data: apiFiles }] = await Promise.all([
		apiGetTemplate(id, language),
		apiGetFiles(id)
	]);
	const attachments = getFilteredFilesByTemplateId(apiFiles, id);

	setComposerData((composerData) => ({ ...composerData, template_name: template.name }));
	subjectEditor.insertReplaceHtmlContent({
		clearBefore: true,
		html: escapeText(template.subject),
		[MergeFieldsPlugin.name]: { placeholderAsValue: true }
	});
	wysiwyg.insertReplaceHtmlContent({
		getElementToReplace: (editorEl) => {
			const possibleElements = editorEl.querySelectorAll('[data-pipedrivetemplate]');

			return [].filter.call(possibleElements, (el) => {
				return !el.closest('blockquote');
			})[0];
		},
		html: `<div data-pipedrivetemplate>${template.content}</div>`,
		[MergeFieldsPlugin.name]: { placeholderAsValue: true }
	});

	replaceTemplateAttachments(attachments);

	if (attachments.length) {
		const sessionToken = `session_token=${getCookieValue('pipe-session-token')}`;

		wysiwyg.callPluginMethod(InlineImagesPlugin.name, 'prepareInlineImagesForDisplaying', [
			attachments.filter((file) => file.inline_flag),
			sessionToken
		]);
	}

	// Trigger at least one event on change so validators can run
	wysiwyg.editorEl.dispatchEvent(
		new Event('input', {
			bubbles: true,
			cancelable: true
		})
	);
};

const getTemplates = (language, setTemplates, API) => {
	apiGetTemplates(language, {
		error: () => {
			setTemplates([]);
		},
		success: (templates) => {
			const templatesOrder = API.userSelf.settings.get('email_templates_order') || [];

			const sortedTemplates = getSortedMailTemplates(templates, templatesOrder);

			setTemplates(sortedTemplates);
		}
	});
};

const TemplateAndVisibilityPickers = ({
	composerData,
	setComposerData,
	isModalVisible,
	subjectEditor,
	wysiwyg,
	modalElement
}) => {
	const translator = useTranslator();
	const API = useContext(APIContext);
	const { actions } = useStore({ replaceTemplateAttachments });

	const language = API.userSelf.get('language').language_code;
	const [templates, setTemplates] = useState(null);

	useEffect(() => {
		if (isModalVisible) {
			getTemplates(language, setTemplates, API);
		}
	}, [language, isModalVisible, API]);

	const sharedDescription = translator.gettext(
		'This email conversation will be visible to others only when it’s linked to contacts and deals in Pipedrive.'
	);
	const privateDescription = translator.gettext(
		'This email conversation can still be linked to contacts and deals in Pipedrive, but it will only be visible to you.'
	);

	return (
		<Container>
			<Label>{translator.gettext('Email template')}</Label>
			<Label>{translator.gettext('Visibility')}</Label>
			<TemplatePicker
				value={composerData.template_id}
				onChange={(id) => {
					insertTemplate({
						id,
						language,
						subjectEditor,
						wysiwyg,
						replaceTemplateAttachments: actions.replaceTemplateAttachments,
						setComposerData
					});
					setComposerData((composerData) => ({ ...composerData, template_id: id }));
				}}
				isModalVisible={isModalVisible}
				templates={templates}
				modalElement={modalElement}
			/>
			<Select
				value={composerData.shared_flag ? 'shared' : 'private'}
				onChange={(value) =>
					setComposerData((composerData) => ({
						...composerData,
						shared_flag: value === 'shared'
					}))
				}
				icon={composerData.shared_flag ? 'unlocked' : 'locked'}
				data-ui-test-id="group-email-visibility-picker"
			>
				<Select.Option
					value="shared"
					getContentForTrigger={() => translator.gettext('Shared')}
					data-ui-test-id="group-email-shared-email-option"
				>
					<SharedOption>
						<SharedOptionsIcon icon="unlocked" size="s" />
						<SharedOptionsTitle>
							{translator.gettext('Share within your company')}
						</SharedOptionsTitle>
						<SharedOptionsDescription>{sharedDescription}</SharedOptionsDescription>
					</SharedOption>
				</Select.Option>
				<Select.Option
					value="private"
					getContentForTrigger={() => translator.gettext('Private')}
				>
					<SharedOption>
						<SharedOptionsIcon icon="locked" size="s" />
						<SharedOptionsTitle>
							{translator.gettext('Keep this conversation private')}
						</SharedOptionsTitle>
						<SharedOptionsDescription>{privateDescription}</SharedOptionsDescription>
					</SharedOption>
				</Select.Option>
			</Select>
		</Container>
	);
};

TemplateAndVisibilityPickers.propTypes = {
	composerData: PropTypes.object.isRequired,
	setComposerData: PropTypes.func.isRequired,
	isModalVisible: PropTypes.bool,
	subjectEditor: PropTypes.object,
	wysiwyg: PropTypes.object,
	modalElement: PropTypes.object
};

export default TemplateAndVisibilityPickers;
