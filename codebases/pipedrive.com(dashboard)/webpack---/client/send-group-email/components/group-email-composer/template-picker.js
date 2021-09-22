import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Select, Icon, Spinner } from '@pipedrive/convention-ui-react';
import { useTranslator } from 'utils/translator/translator-hook';

const TemplatesSpinner = styled(Spinner)`
	display: flex;
	align-content: center;
	justify-content: center;
`;
const TemplateOption = styled.div`
	display: grid;
	grid-template: 'a b c' auto / 16px auto 16px;
	grid-column-gap: 8px;
	align-items: center;
	text-align: left;
`;
const OptionName = styled.span`
	grid-area: b;
`;

const TemplateDropdown = styled.div`
	max-height: 300px;
`;

const TemplatePicker = ({ onChange, value, templates, modalElement }) => {
	const translator = useTranslator();

	const loading = templates === null;

	return (
		<Select
			onChange={onChange}
			value={value}
			placeholder={translator.gettext('Choose a template')}
			filter={!loading}
			filterNotFoundText={translator.gettext('No match found')}
			icon="email-template"
			data-ui-test-id="group-email-template-picker"
			portalTo={modalElement}
		>
			{loading ? (
				<TemplatesSpinner size="s" />
			) : (
				<TemplateDropdown>
					{templates.map(
						({ id, name, shared_flag: isShared, has_attachments: hasAttachments }) => (
							<Select.Option
								value={id}
								key={id}
								itemToString={() => name}
								getContentForTrigger={() => name}
								data-ui-test-id="group-email-template-option"
							>
								<TemplateOption>
									{!isShared && <Icon icon="locked" size="s" />}
									<OptionName>{name}</OptionName>
									{hasAttachments && <Icon icon="file" size="s" />}
								</TemplateOption>
							</Select.Option>
						)
					)}
				</TemplateDropdown>
			)}
		</Select>
	);
};

TemplatePicker.propTypes = {
	value: PropTypes.any,
	onChange: PropTypes.func.isRequired,
	templates: PropTypes.array,
	modalElement: PropTypes.object
};

export default TemplatePicker;
