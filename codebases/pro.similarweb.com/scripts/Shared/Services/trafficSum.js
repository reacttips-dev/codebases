import dayjs from "dayjs";
import angular from "angular";
import _ from "lodash";

angular.module("shared").factory("trafficSum", function (chosenSites) {
    /**
     * isFirstOf
     * @type {{day: Function, month: Function, week: Function}}
     */
    const isFirstOf = {
        day: function (d) {
            return true;
        },
        month: function (d) {
            return d.clone().subtract(1, "days").month() !== d.month();
        },
        week: function (d) {
            return d.weekday() === 0;
        },
    };

    /**
     * isLastOf
     * @type {{day: Function, month: Function, week: Function}}
     */
    const isLastOf = {
        day: function (d) {
            return true;
        },
        month: function (d) {
            return d.clone().add(1, "days").month() !== d.month();
        },
        week: function (d) {
            return d.weekday() === 6;
        },
    };

    /**
     * filter data before when
     * @param data {[date, value]} data array
     * @param when {date} the date pivot
     */
    const notBefore = function (data, when) {
        const res = _.filter(data, function (point) {
            return point && point[0] >= when;
        });
        return res;
    };

    /**
     * filter data after when
     * @param data {[date, value]} data array
     * @param when {date} the date pivot
     */
    const notAfter = function (data, when) {
        const res = _.filter(data, function (point) {
            return point && point[0] <= when;
        });
        return res;
    };

    /**
     * combine two series around a pivot date
     *
     * ----- Series A ---| PIVOT |----- Series B -----
     *
     * @param seriesA {[date,value]} data series A
     * @param seriesB {[date,value]} data series B
     * @param pivot {date} pivot date
     * @param duration {'daily'|'weekly'|'monthly'}
     * @param weights
     * @param fromDate
     * @param toDate
     * @param doTrimPartials
     */
    const pivotSeries = function (
        seriesA,
        seriesB,
        pivot,
        duration,
        weights,
        fromDate,
        toDate,
        doTrimPartials,
    ) {
        let llimit, rlimit;

        switch (duration) {
            case "daily":
            case "monthly":
                rlimit = pivot;
                llimit = pivot;
                break;
            case "weekly":
                rlimit = dayjs(pivot).add(6, "days").valueOf();
                llimit = pivot;
                break;
        }

        // copy values
        const seriesAData = seriesA.data;
        const seriesBData = seriesB.data;

        //  values weight
        seriesAData = getWeightedData(
            seriesAData,
            weights && weights[0].data,
            duration,
            fromDate,
            toDate,
            doTrimPartials,
        );
        seriesBData = getWeightedData(
            seriesBData,
            weights && weights[0].data,
            duration,
            fromDate,
            toDate,
            doTrimPartials,
        );

        // pivot values
        seriesA.data = notAfter(seriesAData, rlimit);
        seriesB.data = notBefore(seriesBData, llimit);
    };

    /**
     * aggregate values
     * @param dailyValues
     * @param weights
     * @param fromDate
     * @param toDate
     * @param duration { 'month' | 'week' | 'day' }
     * @returns {{from: *, to: *, originalFrom: (*|number), originalTo: (*|number), values: Array, trimFromIdx: (*|number), trimToIdx: (*|number)}}
     */
    const aggregate = function (
        dailyValues,
        weights,
        fromDate,
        toDate,
        duration /* ['week' / 'month'] */,
    ) {
        const startDate = dayjs(fromDate),
            d = startDate.clone(),
            durationStart = d.clone(),
            startIdx = 0,
            i = startIdx,
            length = dailyValues.length,
            sum = 0,
            resLength = 0,
            res = [];

        let trimFromIdx, trimToIdx, wasLast;

        while (i < length) {
            if (durationStart === null) {
                durationStart = d.clone();
            }

            const dailyValue = dailyValues[i];
            // ignore nulls in monthly
            if (duration === "month" && !dailyValue) {
                dailyValue = 0;
            }

            sum += dailyValue * weights[i];

            if (trimFromIdx === undefined && isFirstOf[duration](d)) {
                trimFromIdx = resLength;
            }
            if ((wasLast = isLastOf[duration](d))) {
                /*if (i > startIdx) */
                if (dailyValue != null) {
                    res.push([durationStart.utc().valueOf(), sum]);
                }
                resLength++;
                durationStart = null;
                sum = 0;
                trimToIdx = resLength;
            }

            i++;
            d.add(1, "days");
        }
        if (!wasLast) {
            res.push([durationStart.utc().valueOf(), sum]);
        }

        return {
            from: startDate.toDate(),
            to: d.toDate(),
            originalFrom: fromDate.getTime(),
            originalTo: toDate.getTime(),
            values: res,
            trimFromIdx: trimFromIdx || 0,
            trimToIdx: trimToIdx || resLength,
        };
    };

    /**
     * weekly aggregate
     * @param dailyValues
     * @param weights
     * @param fromDate
     * @returns {{values: Array}}
     */
    const aggregateWeekly = function (dailyValues, weights, fromDate) {
        const dayjsFromDate = dayjs(fromDate);
        const weeklyValues = [];
        let weeklySum = 0;
        let daysCounter = 0;

        for (let i = 0; i < dailyValues.length; i++) {
            weeklySum += dailyValues[i] * weights[i];
            if (++daysCounter === 7) {
                const date = dayjsFromDate
                    .add(i < 7 ? 0 : daysCounter, "days")
                    .utc()
                    .valueOf();
                if (dailyValues[i] == null) {
                    weeklyValues.push(null);
                } else {
                    weeklyValues.push([date, weeklySum]);
                }

                weeklySum = 0;
                daysCounter = 0;
            }
        }

        if (daysCounter !== 0) {
            weeklyValues.push([dayjsFromDate.add(7, "days").utc().valueOf(), weeklySum]);
        }

        return { values: weeklyValues };
    };

    /**
     *
     * @param data
     * @param duration
     * @returns {Array.<T>}
     */
    const trimPartials = function (data) {
        return data.values.slice(data.trimFromIdx, data.trimToIdx);
    };

    /**
     *
     * @param dailyValues
     * @param weights
     * @param fromDate
     * @param toDate
     * @param doTrimPartials
     * @param duration { 'month' | 'week' | 'day' }
     * @returns {*}
     */
    const retrieve = function (dailyValues, weights, fromDate, toDate, doTrimPartials, duration) {
        const cacheRoot = (dailyValues._trafficSumCache = dailyValues._trafficSumCache || {}),
            data = (cacheRoot[duration] = cacheRoot[duration] || {});

        if (
            !data ||
            data.originalFrom !== fromDate.getTime() ||
            data.originalTo !== toDate.getTime()
        ) {
            // Separated weekly method because we want to calculate the weeks in a different way than the "aggregate" method does
            // Anyway we should not aggregate in client only on server. So this is temporary
            if (duration === "week") {
                cacheRoot[duration] = aggregateWeekly(dailyValues, weights, fromDate);
            } else {
                cacheRoot[duration] = aggregate(dailyValues, weights, fromDate, toDate, duration);
            }
            data = cacheRoot[duration];
        }
        return doTrimPartials ? trimPartials(data, duration) : data.values;
    };

    /**
     *
     * @param data {[date, value]} data array
     * @param weights
     * @param duration { 'monthly' | 'weekly' | 'daily' }
     * @param fromDate
     * @param toDate
     * @param doTrimPartials
     * @returns {*}
     */
    const getWeightedData = function (data, weights, duration, fromDate, toDate, doTrimPartials) {
        const emptyWeights = _.map(data, function () {
                return 1;
            }),
            weightSums = api[duration || "monthly"](
                weights || emptyWeights,
                emptyWeights,
                fromDate,
                toDate,
                doTrimPartials,
            ),
            index = 0,
            start = dayjs(fromDate);

        //weights = _.map(weights || emptyWeights, function (day) {
        weights = !weights
            ? emptyWeights
            : _.map(weights, function (day) {
                  if (
                      index !== weightSums.length - 1 &&
                      (start.isAfter(weightSums[index + 1] ? weightSums[index + 1][0] : 0) ||
                          start.isSame(dayjs(weightSums[index + 1][0])))
                  ) {
                      index++;
                  }
                  let val = day / weightSums[index][1];
                  val = isNaN(val) ? 0 : val;
                  start = start.add(1, "days");
                  return val;
              });

        return api[duration || "monthly"](data, weights, fromDate, toDate, doTrimPartials);
    };

    /**
     * SINGLE OLD
     * @param duration { 'monthly' | 'weekly' | 'daily' }
     * @param data {[date, value]} data array
     * @param weights
     * @param fromDate
     * @param toDate
     * @param doTrimPartials
     * @returns {*}
     */
    const asDurationSingleOld = function (
        duration,
        data,
        weights,
        fromDate,
        toDate,
        doTrimPartials,
    ) {
        return getWeightedData(data, weights, duration, fromDate, toDate, doTrimPartials);
    };

    /**
     * SINGLE NEW
     * @param duration { 'monthly' | 'weekly' | 'daily' }
     * @param data {{old: *, new: *}} data array
     * @param weights
     * @param fromDate
     * @param toDate
     * @param doTrimPartials
     * @returns {{old: *, new: *}}
     */
    const asDurationSingleNew = function (
        duration,
        data,
        weights,
        fromDate,
        toDate,
        doTrimPartials,
        algorithmChangeDate,
    ) {
        const websiteDataOld = _.clone(data.old);
        const websiteDataNew = _.clone(data.new);

        // combine series
        pivotSeries(
            websiteDataOld,
            websiteDataNew,
            algorithmChangeDate,
            duration,
            weights,
            fromDate,
            toDate,
            doTrimPartials,
        );

        return {
            old: websiteDataOld,
            new: websiteDataNew,
        };
    };

    /**
     * COMPARE OLD
     * @param duration { 'monthly' | 'weekly' | 'daily' }
     * @param data {Array} data array
     * @param weights
     * @param fromDate
     * @param toDate
     * @param doTrimPartials
     * @returns {Array}
     */
    const asDurationCompareOld = function (
        duration,
        data,
        weights,
        fromDate,
        toDate,
        doTrimPartials,
    ) {
        const res = [];
        for (let i = 0; i < chosenSites.count(); i++) {
            const item = _.clone(data[i]);
            item.data = getWeightedData(
                item.data,
                weights && weights[i].data,
                duration,
                fromDate,
                toDate,
                doTrimPartials,
            );
            res.push(item);
        }
        return res;
    };

    /**
     * COMPARE NEW
     * @param duration { 'monthly' | 'weekly' | 'daily' }
     * @param data {{old: *, new: *}} data array
     * @param weights
     * @param fromDate
     * @param toDate
     * @param doTrimPartials
     * @returns {{old: *, new: *}}
     */
    const asDurationCompareNew = function (
        duration,
        data,
        weights,
        fromDate,
        toDate,
        doTrimPartials,
        algorithmChangeDate,
    ) {
        const websiteCompareDataOld = _.clone(data.old);
        const websiteCompareDataNew = _.clone(data.new);

        const oldArr = [];
        const newArr = [];

        // each compared
        for (let i = 0; i < chosenSites.count(); i++) {
            const websiteDataOld = websiteCompareDataOld.data[i];
            const websiteDataNew = websiteCompareDataNew.data[i];

            const resSingle = asDurationSingleNew(
                duration,
                { old: websiteDataOld, new: websiteDataNew },
                weights,
                fromDate,
                toDate,
                doTrimPartials,
                algorithmChangeDate,
            );
            oldArr.push(resSingle.old);
            newArr.push(resSingle.new);
        }

        websiteCompareDataOld.data = oldArr;
        websiteCompareDataNew.data = newArr;
        return {
            old: websiteCompareDataOld,
            new: websiteCompareDataNew,
        };
    };

    /**
     * The public API
     * @type {{daily: Function, weekly: Function, monthly: Function, asDuration: Function}}
     */
    const api = {
        /**
         * daily values
         * @param dailyValues
         * @param weights
         * @param fromDate
         * @param toDate
         * @param doTrimPartials
         * @returns {*}
         */
        daily: function (dailyValues, weights, fromDate, toDate, doTrimPartials) {
            return retrieve(dailyValues, weights, fromDate, toDate, doTrimPartials, "day");
        },

        /**
         * weekly values
         * @param dailyValues
         * @param weights
         * @param fromDate
         * @param toDate
         * @param doTrimPartials
         * @returns {*}
         */
        weekly: function (dailyValues, weights, fromDate, toDate, doTrimPartials) {
            return retrieve(dailyValues, weights, fromDate, toDate, doTrimPartials, "week");
        },

        /**
         * monthly values
         * @param dailyValues
         * @param weights
         * @param fromDate
         * @param toDate
         * @param doTrimPartials
         * @returns {*}
         */
        monthly: function (dailyValues, weights, fromDate, toDate, doTrimPartials) {
            return retrieve(dailyValues, weights, fromDate, toDate, doTrimPartials, "month");
        },

        /**
         * main access point
         * @param duration { 'monthly' | 'weekly' | 'daily' }
         * @param data {{old: *, new: *}} data array
         * @param weights
         * @param fromDate
         * @param toDate
         * @param doTrimPartials
         * @param splitGraphForNewAlgo
         * @returns {*}
         */
        asDuration: function (
            duration,
            data,
            weights,
            fromDate,
            toDate,
            doTrimPartials,
            algorithmChangeDate,
        ) {
            if (!chosenSites.isCompare()) {
                if (algorithmChangeDate) {
                    return asDurationSingleNew(
                        duration,
                        data,
                        weights,
                        fromDate,
                        toDate,
                        doTrimPartials,
                        algorithmChangeDate,
                    );
                } else {
                    return asDurationSingleOld(
                        duration,
                        data,
                        weights,
                        fromDate,
                        toDate,
                        doTrimPartials,
                    );
                }
            } else {
                if (algorithmChangeDate) {
                    return asDurationCompareNew(
                        duration,
                        data,
                        weights,
                        fromDate,
                        toDate,
                        doTrimPartials,
                        algorithmChangeDate,
                    );
                } else {
                    return asDurationCompareOld(
                        duration,
                        data,
                        weights,
                        fromDate,
                        toDate,
                        doTrimPartials,
                    );
                }
            }
        },
    };

    return api;
});
