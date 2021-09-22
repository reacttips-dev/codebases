import * as _ from "lodash";

type OrganicPaidMap = {
    Organic: number[];
    Paid: number[];
};

export function createOrganicPaidService() {
    const PAID = "Paid";
    const ORGANIC = "Organic";
    const PAID_POSITION = 1;
    const ORGANIC_POSITION = 0;

    return {
        mapSum(arr: any) {
            return _.map(arr, (i) => i[ORGANIC_POSITION] + i[PAID_POSITION]);
        },
        mapSumOrganic(arr: any) {
            return _.map(arr, (i) => i[ORGANIC_POSITION]);
        },
        mapSumPaid(arr: any) {
            return _.map(arr, (i) => i[PAID_POSITION]);
        },
        mapSumVolumes(data: any) {
            const items = {};

            _.forEach(data, (item, name) => {
                items[name] = this.reduce(item);
            });

            return items;
        },
        reduce(data: any) {
            return data.reduce((memo, item) => {
                return memo + item[ORGANIC_POSITION] + item[PAID_POSITION];
            }, 0);
        },
        reduceOrganic(data: any) {
            return data.reduce((memo, item) => {
                return memo + item[ORGANIC_POSITION];
            }, 0);
        },
        reducePaid(data: any) {
            return data.reduce((memo, item) => {
                return memo + item[PAID_POSITION];
            }, 0);
        },
        reduceOrganicVolumes(data: any) {
            let total = 0;

            _.forEach(data, (item) => {
                total += this.reduceOrganic(item);
            });

            return total;
        },
        reducePaidVolumes(data: any) {
            let total = 0;

            _.forEach(data, (item) => {
                total += this.reducePaid(item);
            });

            return total;
        },
        calculateOrganicVsPaid(data: any) {
            let totalPaid = data.reduce((sum, item) => {
                return sum + item[PAID_POSITION];
            }, 0);

            const total = data.reduce((sum, item) => {
                return sum + item[ORGANIC_POSITION] + item[PAID_POSITION];
            }, 0);

            totalPaid =
                totalPaid < 1000
                    ? Math.floor(totalPaid)
                    : window.similarweb.utils.bigNumber(totalPaid);

            const totalOrganic = window.similarweb.utils.bigNumber(total) - totalPaid;

            return {
                realTotal: total,
                total: window.similarweb.utils.bigNumber(total),
                organicTotal: totalOrganic,
                paidTotal: totalPaid,
                organic: total === 0 ? 0 : totalOrganic / total,
                paid: total === 0 ? 0 : totalPaid / total,
            };
        },
        namedOrganicPaid: {
            mapSumVolumes(data: { [key: string]: OrganicPaidMap }, categoriesToSplit?: string[]) {
                const items = {};

                _.forEach(data, (item, name) => {
                    if (_.includes(categoriesToSplit, name)) {
                        items[ORGANIC + name] = this.reduceOrganic(item);
                        items[PAID + name] = this.reducePaid(item);
                    } else {
                        const sumOrganic = item[ORGANIC].reduce((memo, item) => {
                            return memo + item;
                        }, 0);
                        const sumPaid = item[PAID].reduce((memo, item) => {
                            return memo + item;
                        }, 0);

                        items[name] = sumOrganic + sumPaid;
                    }
                });

                return items;
            },
            reduceOrganicVolumes(data: any) {
                let total = 0;

                _.forEach(data, (item) => {
                    total += this.reduceOrganic(item);
                });

                return total;
            },
            reducePaidVolumes(data: any) {
                let total = 0;

                _.forEach(data, (item) => {
                    total += this.reducePaid(item);
                });

                return total;
            },
            reduceOrganic(data: OrganicPaidMap) {
                return data[ORGANIC].reduce((memo, item) => {
                    return memo + item;
                }, 0);
            },
            reducePaid(data: OrganicPaidMap) {
                return data[PAID].reduce((memo, item) => {
                    return memo + item;
                }, 0);
            },
            mapValues(data: { [key: string]: OrganicPaidMap }, categoriesToSplit?: string[]) {
                const items = {};

                _.forEach(data, (item, name) => {
                    if (_.includes(categoriesToSplit, name)) {
                        items[ORGANIC + name] = item[ORGANIC];
                        items[PAID + name] = item[PAID];
                    } else {
                        items[name] = _.zipWith(item[ORGANIC], item[PAID], _.add);
                    }
                });

                return items;
            },
        },
    };
}

export default createOrganicPaidService();
