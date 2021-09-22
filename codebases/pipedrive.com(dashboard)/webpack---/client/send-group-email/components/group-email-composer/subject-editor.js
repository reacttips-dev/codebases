import React from 'react';
import PropTypes from 'prop-types';
import { createGlobalStyle } from 'styled-components';
import colors from '@pipedrive/convention-ui-css/dist/amd/colors.js';
import { useTranslator } from 'utils/translator/translator-hook';
import InlineEditor from 'shared/inline-editor';

const GlobalSubject = createGlobalStyle`
	.inlineEditor.${(props) => props.className} {
		flex: 0 0 auto;
		border-color: ${colors['$color-black-hex-12']};
	}
`;

const SubjectEditor = React.forwardRef(({ onFocus }, ref) => {
	const translator = useTranslator();
	const className = 'group-email-composer-subject';

	return (
		<React.Fragment>
			<GlobalSubject className={className} />
			<InlineEditor
				ref={ref}
				className={className}
				onFocus={onFocus}
				placeholder={translator.gettext('Subject')}
			/>
		</React.Fragment>
	);
});

SubjectEditor.propTypes = { onFocus: PropTypes.func };

export default SubjectEditor;
