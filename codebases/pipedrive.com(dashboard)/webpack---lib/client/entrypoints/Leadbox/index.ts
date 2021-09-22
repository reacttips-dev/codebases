// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
__webpack_public_path__ = `https://cdn.${app.config.cdnDomain}/leadbox-fe/`;

module.exports = require.ensure(
	['./MicroFeWrapper'],
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	(require) => require('./MicroFeWrapper').default,
);
