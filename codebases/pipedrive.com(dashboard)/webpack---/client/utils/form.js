export const getLinkText = (url) => {
	if (url.length < 40) {
		return url;
	}

	return `${url.slice(0, 30)}...${url.slice(-10)}`;
};

// eslint-disable-next-line complexity
export const getIconType = (fileName) => {
	let ext = fileName.slice(-4).toLowerCase();

	if (ext[0] === '.') {
		ext = ext.slice(1);
	}

	if (ext === 'pdf') {
		return 'file-pdf';
	} else if (['jpeg', 'png', 'jpg', 'gif', 'bmp'].includes(ext)) {
		return 'file-picture';
	} else if (['rar', 'zip'].includes(ext) || ext.includes('gz')) {
		return 'file-zip';
	} else if (ext.includes('doc') || ['txt', 'csv'].includes(ext)) {
		return 'file-document';
	} else if (ext.includes('xls')) {
		return 'file-spreadsheet';
	} else if (ext.includes('ppt')) {
		return 'file-presentation';
	} else if (['mp4', 'mov', 'mpg', 'avi', 'wmv', 'webm'].includes(ext)) {
		return 'file-video';
	} else if (['mp3', 'm4a', 'wav', 'ogg', 'wma', 'wav'].includes(ext)) {
		return 'file-sound';
	}

	return 'file';
};
