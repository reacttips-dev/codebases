// from craneConfig/config.prod.js
// TODO make this a new config that is in each Crane env file

const cloudfrontConstants = {
  prodAssetsRoot: 'https://d3njjcbhbojbot.cloudfront.net/web',
};

export default cloudfrontConstants;

export const { prodAssetsRoot } = cloudfrontConstants;
