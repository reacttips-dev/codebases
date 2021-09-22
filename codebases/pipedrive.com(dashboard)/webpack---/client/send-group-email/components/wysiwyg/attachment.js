import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import colors from '@pipedrive/convention-ui-css/dist/amd/colors.js';
import { Icon, Button, Progressbar, Text } from '@pipedrive/convention-ui-react';
import { combineHumanizedFilesize } from 'utils/helpers';
import { getCookieValue } from '@pipedrive/fetch';

const AttachmentContainer = styled.div`
	border-top: 1px solid ${colors['$color-black-hex-12']};
	margin-top: -1px;
	padding: 2px 8px;
	height: 28px;
	display: flex;
	align-items: center;
`;

const FileName = styled(Text)`
	flex-grow: 1;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	width: 100%;
`;

const FileSize = styled.div`
	flex-grow: 0;
	margin-left: 16px;
	white-space: nowrap;
	display: ${(props) => (props.showfilesize === 'true' ? 'block' : 'none')};
`;

const DeleteFile = styled(Button)`
	flex-grow: 0;
	margin-left: 8px;
`;

const FileUpload = styled(Progressbar)`
	width: 192px;
	display: ${(props) => (props.showprogress === 'true' ? 'block' : 'none')};
`;

const Attachment = ({
	attachment: { file, localId, isLoading, error, loadingPercent },
	deleteFile
}) => {
	const attachmentReady = !(isLoading || error);
	const getLinkProps = () => {
		return {
			href: `${file.url}?session_token=${getCookieValue(
				'pipe-session-token'
			)}&strict_mode=true`,
			target: '_blank',
			rel: 'noopener noreferrer'
		};
	};

	return (
		<AttachmentContainer key={localId} data-ui-test-id="group-email-attachment-container">
			<FileName>
				{attachmentReady ? <a {...getLinkProps()}>{file.name}</a> : file.name}
			</FileName>
			<FileSize showfilesize={`${attachmentReady}`}>
				{combineHumanizedFilesize(file.file_size)}
			</FileSize>
			<FileUpload
				showprogress={`${!attachmentReady}`}
				color={error ? 'red' : 'green'}
				percent={loadingPercent}
			/>

			<DeleteFile size="s" color="ghost" onClick={deleteFile}>
				<Icon icon="trash" size="s" />
			</DeleteFile>
		</AttachmentContainer>
	);
};

Attachment.propTypes = {
	attachment: PropTypes.object.isRequired,
	deleteFile: PropTypes.func.isRequired
};

export default Attachment;
