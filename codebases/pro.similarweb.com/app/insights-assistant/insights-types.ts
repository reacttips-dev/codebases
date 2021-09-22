export interface IInsightPointData {
    value: number;
    date: string;
}

export enum InsightType {
    TREND,
    SPIKE,
    NEW,
}

export const InsightsTypesNames = {
    [InsightType.TREND]: "trend",
    [InsightType.SPIKE]: "spike",
    [InsightType.NEW]: "new",
};

export interface IInsightDetails {
    isInsight: boolean;
    isDecrease?: boolean;
    value?: number;
    period?: string;
}

const TREND_THRESHOLD = 0.05;
const SPIKE_THRESHOLD = 0.1;

export const isNew = (data: IInsightPointData[]): IInsightDetails => {
    for (let i = data.length - 1; i > 0; i--) {
        if (data[i].value > 0 && (data[i - 1].value === 0 || !data[i - 1].value)) {
            return {
                isInsight: true,
                period: data[i].date,
            };
        }
    }

    return {
        isInsight: false,
    };
};

export const isSpike = (data: IInsightPointData[]): IInsightDetails => {
    const change = data[data.length - 1].value / data[data.length - 2].value - 1;
    if (Math.abs(change) > SPIKE_THRESHOLD) {
        return {
            isInsight: true,
            isDecrease: change < 0,
            value: Math.abs(change),
            period: data[data.length - 1].date,
        };
    } else {
        return {
            isInsight: false,
        };
    }
};

export const isTrend = (data: IInsightPointData[]): IInsightDetails => {
    let isDecrease;
    for (let i = 0; i < data.length - 1; i++) {
        const change = data[i + 1].value / data[i].value - 1;
        if (
            Math.abs(change) < TREND_THRESHOLD ||
            (isDecrease !== undefined && isDecrease !== change < 0)
        ) {
            return {
                isInsight: false,
            };
        }
        isDecrease = change < 0;
    }

    const change = data[data.length - 1].value / data[0].value - 1;
    return {
        isInsight: true,
        value: Math.abs(change),
        isDecrease: change < 0,
    };
};
