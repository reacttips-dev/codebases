import React, { useState } from 'react';
import { Button, VideoThumbnail, VideoOverlay } from '@pipedrive/convention-ui-react';
import PropTypes  from 'prop-types';

import style from './style.css';

const ImportDataContent = ({ gettext, gettingStartedItemClick, userLang, GSVersion }) => {
	const [visible, setVisible] = useState(false);

	const videoUrl = 'https://pipedrive.hubs.vidyard.com/watch/y5HxrbuSNjtq5doAEL5r5U';
	const importingArticleUrl = `https://support.pipedrive.com/${userLang}/article/importing-data-into-pipedrive-with-spreadsheets`;
	const dataOrganizingArticleUrl = `https://support.pipedrive.com/${userLang}/article/how-is-pipedrive-data-organized`;
	const xlsxLinkUrl = 'https://cdn.eu-central-1.pipedriveassets.com/import-service-frontend/samples/pipedrive_sample_data.xlsx?v=1625227519184';
	const csvLinkUrl = 'https://cdn.eu-central-1.pipedriveassets.com/import-service-frontend/samples/pipedrive_sample_data.csv?v=1625227519184';

	function onClick() {
		gettingStartedItemClick('video', videoUrl);
		setVisible(true);
	}

	function onClose() {
		setVisible(false);
	}

	return (
		<div className={style.ImportDataContent}>
			<div>
				<Button color="green" href="/settings/import" onClick={() => {
					gettingStartedItemClick('link', '/settings/import', GSVersion);
				}}>
					{ gettext('Import data') }
				</Button>
			</div>
			<div>
				<div className={style.ImportDataContent__title}>
					{ gettext('Import from spreadsheet or other apps') }
				</div>
				<div className={style.ImportDataContent__video}>
					<VideoThumbnail onClick={onClick} image='https://cdn.vidyard.com/thumbnails/CjQvACMxzVLOgRg4UwtPlw/6cbe29c20f4df7beb3d32c.jpg' noGrayscale={true} />
					{visible && (
						<VideoOverlay videoUrl={videoUrl} visible={visible}
							onClose={onClose} />)}
				</div>
			</div>
			<div className={style.ImportDataContent__separator}/>
			<div>
				<div className={style.ImportDataContent__title}>
					{ gettext('Knowledge base Articles') }
				</div>
				<div>
					<div className={style.ImportDataContent__linkWrapper}>
						<a className={style.ImportDataContent__link} id="import-data-content-link-import"
							href={importingArticleUrl}
							target="_blank"
							rel="noopener noreferrer"
							onClick={() => {
								gettingStartedItemClick('article', importingArticleUrl, GSVersion);
							}}
						>
							{ gettext('Importing data into Pipedrive with spreadsheets') }
						</a>
					</div>
					<div className={style.ImportDataContent__linkWrapper}>
						<a className={style.ImportDataContent__link} id="import-data-content-link-organize" target="_blank"
							href={dataOrganizingArticleUrl}
							rel="noopener noreferrer"
							onClick={() => {
								gettingStartedItemClick('article', dataOrganizingArticleUrl, GSVersion);
							}}
						>{ gettext('How is Pipedrive data organized?') }</a>
					</div>
				</div>
			</div>
			<div className={style.ImportDataContent__separator}/>
			<div>
				<div className={style.ImportDataContent__title}>
					{ gettext('Learn about the file structure') }
				</div>
				<div>
					<div className={style.ImportDataContent__linkWrapper}>
						<a className={style.ImportDataContent__link} id="import-data-content-link-xlsx"
							href={xlsxLinkUrl}
							target="_blank"
							rel="noopener noreferrer"
							onClick={() => {
								gettingStartedItemClick('link', xlsxLinkUrl, GSVersion);
							}}
						>{ gettext('Download .xlsx sample file') }</a>
					</div>
					<div className={style.ImportDataContent__linkWrapper}>
						<a className={style.ImportDataContent__link} id="import-data-content-link-csv"
							href={csvLinkUrl}
							target="_blank"
							rel="noopener noreferrer"
							onClick={() => {
								gettingStartedItemClick('link', csvLinkUrl, GSVersion);
							}}
						>{ gettext('Download .csv sample file') }</a>
					</div>
				</div>
			</div>
		</div>
	);
};

ImportDataContent.propTypes = {
	gettext: PropTypes.func.isRequired,
	gettingStartedItemClick: PropTypes.func.isRequired,
	userLang: PropTypes.string,
	GSVersion: PropTypes.object.isRequired,
};

export default ImportDataContent;