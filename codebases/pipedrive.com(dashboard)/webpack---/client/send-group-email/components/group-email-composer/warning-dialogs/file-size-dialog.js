import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Dialog, Button, Text } from '@pipedrive/convention-ui-react';
import { useTranslator } from 'utils/translator/translator-hook';

const FileList = styled.ul`
	margin-top: 8px;
`;

const FileName = styled.li`
	width: 100%;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const FileSizeDialog = ({ files }) => {
	const [isDialogVisible, setDialogVisibility] = useState(false);
	const translator = useTranslator();

	const alertMessage = translator.ngettext(
		'The uploaded file is too big. Maximum file size is 50MB.',
		'The uploaded files are too big. Maximum file size is 50MB.',
		files.length
	);

	useEffect(() => {
		setDialogVisibility(!!files.length);
	}, [files]);

	return (
		<Dialog
			visible={isDialogVisible}
			closeOnEsc
			onClose={() => setDialogVisibility(false)}
			actions={
				<Button onClick={() => setDialogVisibility(false)}>
					{translator.gettext('OK')}
				</Button>
			}
		>
			<Text>
				{alertMessage}
				<FileList>
					{files.map(({ localId, name }) => (
						<FileName key={localId}>{name}</FileName>
					))}
				</FileList>
			</Text>
		</Dialog>
	);
};

FileSizeDialog.propTypes = { files: PropTypes.array.isRequired };

export default FileSizeDialog;
