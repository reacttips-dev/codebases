import React from 'react';

import { Avatar, Icon } from '@pipedrive/convention-ui-react';
import { ITEM_TYPES, IMAGE_FILE_EXTENSIONS } from 'utils/constants';
import searchItemPropType from 'utils/searchItemPropType';

import styles from './style.scss';

const { DEAL, LEAD, PERSON, ORGANIZATION, PRODUCT, FILE, MAIL_ATTACHMENT, KEYWORD } = ITEM_TYPES;

const cuiIconToExtensionMapping = Object.freeze({
	'file-pdf': ['pdf'],
	'file-picture': IMAGE_FILE_EXTENSIONS,
	'file-document': ['docx', 'doc', 'gdoc', 'odt'],
	'file-presentation': ['pptx', 'ppt'],
	'file-sound': ['mp3', 'm4a', 'wav', 'ogg'],
	'file-spreadsheet': ['xlsx', 'xlsm', 'xls', 'gsheet', 'numbers', 'ods'],
	'file-video': ['mp4'],
	'file-zip': ['zip'],
});

function getIconFromExtension(extension) {
	for (const [cuiIconName, extensions] of Object.entries(cuiIconToExtensionMapping)) {
		if (extensions.includes(extension)) {
			return cuiIconName;
		}
	}
	return FILE;
}

function FileIcon({ item }) {
	const extension = item.name?.split('.').pop();
	const icon = getIconFromExtension(extension);

	return <Icon icon={icon} />;
}

FileIcon.propTypes = {
	item: searchItemPropType,
};

function IconByItemType({ item }) {
	switch (item.type) {
		case DEAL:
			return <Icon icon="deal" />;

		case LEAD:
			return <Icon icon="lead" />;

		case PERSON:
			return <Avatar name={item.name} img={item.picture?.url} size="s" />;

		case ORGANIZATION:
			return <Avatar type="organization" size="s" />;

		case PRODUCT:
			return <Icon icon="product" />;

		case MAIL_ATTACHMENT:
		case FILE:
			return <FileIcon item={item} />;

		case KEYWORD:
			return <Icon icon="search" />;

		default:
			return <Icon icon="minus" />;
	}
}

IconByItemType.propTypes = {
	item: searchItemPropType,
};

function ListItemIcon({ item }) {
	return (
		<div className={styles.listItemIcon}>
			<IconByItemType item={item} />
		</div>
	);
}

ListItemIcon.propTypes = {
	item: searchItemPropType,
};

export default ListItemIcon;
