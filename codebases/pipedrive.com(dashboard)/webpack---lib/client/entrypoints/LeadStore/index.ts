// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
__webpack_public_path__ = `https://cdn.${app.config.cdnDomain}/leadbox-fe/`;

// eslint-disable-next-line @typescript-eslint/no-var-requires
module.exports = require.ensure(['./main'], (require) => require('./main').default);
