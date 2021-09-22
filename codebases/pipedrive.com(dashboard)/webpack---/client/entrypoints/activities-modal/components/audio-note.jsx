import React from 'react';
import PropTypes from 'prop-types';
import { AudioPlayer } from '@pipedrive/convention-ui-react';
import styled from 'styled-components';
import ImmutablePropTypes from 'react-immutable-proptypes';

const AudioNoteWrapper = styled.div``;

const AudioNote = ({ mediaFile, dataTest }) => {
	if (!mediaFile) {
		return null;
	}

	const url = mediaFile.get('url');
	const isGoogleDriveFile = url.indexOf('drive.google') !== -1;
	const audioPlayerProps = isGoogleDriveFile
		? { onModeChange: () => window.open(url, '_blank') }
		: { source: url };

	return (
		<AudioNoteWrapper data-test={dataTest}>
			<AudioPlayer title={mediaFile.get('clean_name')} {...audioPlayerProps} />
		</AudioNoteWrapper>
	);
};

AudioNote.propTypes = {
	mediaFile: ImmutablePropTypes.map,
	dataTest: PropTypes.string,
};

export default AudioNote;
