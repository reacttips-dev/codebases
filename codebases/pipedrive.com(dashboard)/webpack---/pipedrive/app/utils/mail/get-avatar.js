const _ = require('lodash');

export const getAvatar = (name, email, iconUrl) => {
	const splittedName = name || email;
	const letterArray = [];

	if (iconUrl && iconUrl !== '') {
		return `
			<div class="cui4-avatar cui4-avatar--l">
				<img src=${iconUrl} />
			</div>
		`;
	}

	_.forEach(splittedName.split(' '), (namePart) => {
		if (namePart.substr(0, 1) === '(') {
			namePart = namePart.substr(1, 1);
		} else {
			namePart = namePart.substr(0, 1);
		}

		letterArray.push(namePart);
	});

	if (letterArray.length > 1) {
		return `
			<div class="cui4-avatar cui4-avatar--l">
				${letterArray[0]}${letterArray[letterArray.length - 1]}
			</div>
		`;
	}

	return `
		<div class="cui4-avatar cui4-avatar--l">
			${letterArray.length ? letterArray[0] : ''}
		</div>
	`;
};
