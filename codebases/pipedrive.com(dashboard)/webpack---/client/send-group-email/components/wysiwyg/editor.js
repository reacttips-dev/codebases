import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import colors from '@pipedrive/convention-ui-css/dist/amd/colors.js';
import fonts from '@pipedrive/convention-ui-css/dist/amd/fonts.js';
import Attachment from './attachment';

const EditorContainer = styled.div`
	outline: none;
	padding: 12px 16px;
	min-height: 200px;

	tbody,
	tr,
	td {
		border: 1px solid ${colors['$color-black-hex-12']};
	}

	td {
		line-height: ${fonts['$line-height-m']};
		padding: 6px 8px;
		text-align: left;
	}

	th {
		font-weight: ${fonts['$font-weight-semi']};
	}

	a {
		color: ${colors['$color-blue-hex']};
	}

	b,
	strong {
		font-weight: bold;
	}

	em,
	i {
		font-style: italic;
	}

	u {
		text-decoration: underline;
	}

	ul {
		list-style: disc;
	}

	ol {
		list-style: decimal;
	}

	ul,
	ol {
		margin-top: 1em;
		margin-bottom: 1em;
		padding: 0 2.5em 0 2.5em;
		padding-inline-start: 2.5em;
		padding-inline-end: 0;

		ul,
		ol {
			margin-top: 0;
			margin-bottom: 0;
		}
	}

	blockquote {
		margin: 0 0 0 0.8em;
		border-left: 2px ${colors['$color-blue-hex']} solid;
		padding-left: 1em;
	}
`;

const AttachmentsListContainer = styled.div`
	border: 1px solid ${colors['$color-black-hex-12']};
	box-sizing: border-box;
	color: ${colors['$color-black-hex-64']};
`;

const FileListBorder = styled.div`
	padding: 16px;
`;

const Editor = React.forwardRef(({ attachments, deleteFile, onFocus }, ref) => {
	// remove inline images from visible attachments list
	attachments = attachments.filter((attachment) => !attachment.file.inline_flag);

	return (
		<React.Fragment>
			<EditorContainer
				ref={ref}
				onFocus={onFocus}
				className="bodyEditor"
				data-ui-test-id="group-email-composer-content-editor"
			/>
			{!!attachments.length && (
				<FileListBorder>
					<AttachmentsListContainer>
						{attachments.map((attachment) => (
							<Attachment
								key={attachment.localId}
								attachment={attachment}
								deleteFile={() => deleteFile(attachment.localId)}
							/>
						))}
					</AttachmentsListContainer>
				</FileListBorder>
			)}
		</React.Fragment>
	);
});

Editor.propTypes = {
	onFocus: PropTypes.func,
	attachments: PropTypes.array.isRequired,
	deleteFile: PropTypes.func.isRequired
};

export default Editor;
