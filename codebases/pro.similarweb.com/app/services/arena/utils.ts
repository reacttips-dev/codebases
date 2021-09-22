const AVERAGE_LINE_KEY = "average";

export interface IEngagementVisitsTableData {
    Data: Array<{
        Site: string;
        Favicon: string;
        TotalVisits: number;
        TotalPagesPerVisit: number;
        TotalDuration: number;
        BounceRate: number;
        UnbounceVisitDuration: number;
        UnbouncePagesPerVists: number;
        UnbounceVisits: number;
        TotalVisitsShare: number;
        TotalUnbounceVisitsShare: number;
    }>;
}

export interface IEngagementVisitsGraphRawData {
    Data: {
        [domain: string]: {
            [webSource: string]: [
                Array<{
                    Key: string;
                    Value: number;
                }>, // regular data
                Array<{
                    Key: string;
                    Value: number;
                }>, // unbounced data
            ];
        };
    };
}

export interface IEngagementTableDataItem {
    mobile?: number;
    desktop?: number;
}

export interface IEngagementTableDataRecord {
    domain?: string;
    Favicon?: string;
    visitDuration: IEngagementTableDataItem;
    bounceRate: IEngagementTableDataItem;
    pagesPerVisit: IEngagementTableDataItem;
    deviceSplit: IEngagementTableDataItem;
    rawMobile: any;
    rawDesktop: any;
    allDomainsIcons?: string[];
    showGAIcon?: boolean;
    isGAPrivate?: boolean;
    rowClass?: string;
}

export interface IEngagementTableData {
    Data?: IEngagementTableDataRecord[];
    maxValues?: IMetricMaxValues;
}

export interface IEngagementTableDataTransform {
    [domain: string]: IEngagementTableDataRecord;
}

export interface IEngagementData {
    Domain: string;
    AvgVisitDuration: { Value: number };
    PagesPerVisit: { Value: number };
    BounceRate: { Value: number };
}

export interface IDeviceShareData {
    Favicon: string;
    Domain: string;
    DesktopMobileShareVisits: number[]; // 0 - desktop, 1 - mobile
}

export interface IMetricMaxValues {
    deviceSplit?: IEngagementTableDataItem;
    bounceRate?: IEngagementTableDataItem;
    visitDuration?: IEngagementTableDataItem;
    pagesPerVisit?: IEngagementTableDataItem;
}

export function buildEngagementTableData(
    mobile: IEngagementData[],
    desktop: IEngagementData[],
    share: IDeviceShareData[],
    domains: string[],
    domainsHeader,
    shouldGetVerifiedData,
): IEngagementTableData {
    const length = share.length;
    const keys = ["deviceSplit", "bounceRate", "visitDuration", "pagesPerVisit"];
    const resultObj: IEngagementTableDataTransform = domains.reduce((acc, domain) => {
        return { ...acc, [domain]: { domain } };
    }, {});
    const average = {} as IEngagementTableDataRecord;
    const maxValues = {} as IMetricMaxValues;
    const skipCount = {
        deviceSplit: { mobile: 0, desktop: 0 },
        bounceRate: { mobile: 0, desktop: 0 },
        visitDuration: { mobile: 0, desktop: 0 },
        pagesPerVisit: { mobile: 0, desktop: 0 },
    };

    keys.forEach((key) => {
        average[key] = { mobile: 0, desktop: 0 };
    });

    Object.keys(resultObj).forEach((domain, index) => {
        const {
            Favicon,
            Domain: shareDomain,
            DesktopMobileShareVisits: [desktopShare, mobileShare],
        } = share[index];
        const {
            Domain: mobileDomain,
            AvgVisitDuration: { Value: mobileVisitDuration },
            PagesPerVisit: { Value: mobilePagesPerVisit },
            BounceRate: { Value: mobileBounceRate },
        } = mobile[index];
        const {
            Domain: desktopDomain,
            AvgVisitDuration: { Value: desktopVisitDuration },
            PagesPerVisit: { Value: desktopPagesPerVisit },
            BounceRate: { Value: desktopBounceRate },
        } = desktop[index];

        // mobile data
        resultObj[mobileDomain] = {
            ...resultObj[mobileDomain],
            visitDuration: {
                mobile: mobileVisitDuration,
                ...(resultObj[mobileDomain].visitDuration || {}),
            },
            pagesPerVisit: {
                mobile: mobilePagesPerVisit,
                ...(resultObj[mobileDomain].pagesPerVisit || {}),
            },
            bounceRate: {
                mobile: mobileBounceRate,
                ...(resultObj[mobileDomain].bounceRate || {}),
            },
        };

        // desktop data
        resultObj[desktopDomain] = {
            ...resultObj[desktopDomain],
            visitDuration: {
                desktop: desktopVisitDuration,
                ...(resultObj[desktopDomain].visitDuration || {}),
            },
            pagesPerVisit: {
                desktop: desktopPagesPerVisit,
                ...(resultObj[desktopDomain].pagesPerVisit || {}),
            },
            bounceRate: {
                desktop: desktopBounceRate,
                ...(resultObj[desktopDomain].bounceRate || {}),
            },
        };

        // device split data
        resultObj[shareDomain] = {
            ...resultObj[shareDomain],
            rawMobile: mobile[index],
            rawDesktop: desktop[index],
            Favicon,
            deviceSplit: {
                mobile: mobileShare,
                desktop: desktopShare,
            },
        };

        // average
        // we filter out any key.mobile/desktop that is undefined from the average.
        // a value of 0 is valid, except when both values for Share are 0.
        // we then increment each metric appropriately.
        keys.forEach((key) => {
            let metric;
            switch (key) {
                case "deviceSplit":
                    metric =
                        mobileShare !== 0 || desktopShare !== 0
                            ? [mobileShare, desktopShare]
                            : [undefined, undefined];
                    break;
                case "bounceRate":
                    metric = [mobileBounceRate, desktopBounceRate];
                    break;
                case "pagesPerVisit":
                    metric = [mobilePagesPerVisit, desktopPagesPerVisit];
                    break;
                case "visitDuration":
                    metric = [mobileVisitDuration, desktopVisitDuration];
                    break;
            }

            if (isValidValue(metric[0])) {
                average[key].mobile += metric[0];
            } else {
                skipCount[key].mobile++;
            }
            if (isValidValue(metric[1])) {
                average[key].desktop += metric[1];
            } else {
                skipCount[key].desktop++;
            }
        });

        // after the last element's metrics have been added to the gross average, we calculate the actual average.
        if (index === length - 1) {
            keys.forEach((key) => {
                average[key].mobile = average[key].mobile / (length - skipCount[key].mobile);
                average[key].desktop = average[key].desktop / (length - skipCount[key].desktop);
            });
        }
    });

    Object.values(resultObj).forEach((item) => {
        // add GA flags
        item.showGAIcon = shouldGetVerifiedData && domainsHeader[item.domain].hasGaToken;
        item.isGAPrivate = domainsHeader[item.domain].privacyStatus === "private";
        // calculating max values
        // Math.max will return NaN if any of the arguments are undefined and the max if any are null(if both null then 0).
        // To compensate, if the value is undefined we replace it with null.
        keys.forEach((key) => {
            if (!maxValues[key]) {
                maxValues[key] = {
                    mobile: isValidValue(item[key].mobile) ? item[key].mobile : null,
                    desktop: isValidValue(item[key].desktop) ? item[key].desktop : null,
                };
            } else {
                maxValues[key] = {
                    mobile: Math.max(
                        isValidValue(item[key].mobile) ? item[key].mobile : null,
                        maxValues[key].mobile,
                    ),
                    desktop: Math.max(
                        isValidValue(item[key].desktop) ? item[key].desktop : null,
                        maxValues[key].desktop,
                    ),
                };
            }
        });
    });

    // add all domains icons to the average row
    average.allDomainsIcons = Object.values(resultObj).map((value) => value.Favicon);
    average.rowClass = "arenaAverage";
    resultObj[AVERAGE_LINE_KEY] = average;

    return {
        Data: Object.values(resultObj),
        maxValues,
    };
}

// even if value is 0, we want true returned
export function isValidValue(value) {
    return value !== undefined && !isNaN(value);
}

export function getValue(value, max) {
    return !isValidValue(value) ? null : value === 0 ? 0 : value / max;
}
