const GOLD_RUSH_PERIOD_START = '2018-06-18T07:00:00Z';
const GOLD_RUSH_PERIOD_END = '2018-07-03T07:00:00Z';
const goldRushUtils = {};

goldRushUtils.isGoldRushPeriodActive = function() {
	const currentTime = new Date();
	const goldRushPeriodStart = new Date(GOLD_RUSH_PERIOD_START);
	const goldRushPeriodEnd = new Date(GOLD_RUSH_PERIOD_END);

	return goldRushPeriodStart < currentTime && currentTime < goldRushPeriodEnd;
};

module.exports = goldRushUtils;
