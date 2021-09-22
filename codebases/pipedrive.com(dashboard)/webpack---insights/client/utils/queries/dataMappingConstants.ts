export enum OverallConversionDataKey {
	WON_CONVERSION = 'won.conversion',
	WON_TOTAL = 'won.total',
	LOST_CONVERSION = 'lost.conversion',
	LOST_TOTAL = 'lost.total',
}

export enum OverallConversionDataField {
	CONVERSION = 'conversion',
	SUM_CONVERSTION = 'sumConversion',
}

export enum DurationDataField {
	DURATION = 'duration',
}

export enum SegmentId {
	WON = 'won',
	LOST = 'lost',
}

export enum RecurringRevenueMovementDataKey {
	NEW = 'paymentsType.new',
	CHURN = 'paymentsType.churn',
	EXPANSION = 'paymentsType.expansion',
	CONTRACTION = 'paymentsType.contraction',
}

export enum RevenuePaymentTypes {
	RECURRING = 'paymentsPaymentType.recurring',
	ADDITIONAL = 'paymentsPaymentType.additional',
	INSTALLMENT = 'paymentsPaymentType.installment',
}

export enum FunnelConversionSummaryTableField {
	REACHED_STAGE = 'reachedStage',
	CONVERSION_TO_NEXT_STAGE = 'conversionToNextStage',
	CONVERSION_TO_WON = 'conversionToWon',
	CONVERSION_TO_LOST = 'conversionToLost',
}

export enum DurationSummaryTableField {
	AVERAGE_DURATION = 'averageDuration',
	NUMBER_OF_DEALS = 'numberOfDeals',
	TOTAL = 'total',
}

export const funnelConversionPercentageColumns = [
	FunnelConversionSummaryTableField.CONVERSION_TO_NEXT_STAGE,
	FunnelConversionSummaryTableField.CONVERSION_TO_WON,
	FunnelConversionSummaryTableField.CONVERSION_TO_LOST,
];
