import dayjs from "dayjs";
import { IOutgoingPaidTrafficChartSiteData } from "./OutgoingPaidTrafficTypes";

/**
 * Converts the given date string to a UNIX timepstamp
 */
const convertDateStringToUnix = (dateString) => {
    const formattedDate = dayjs.utc(dateString).unix() * 1000;
    return formattedDate;
};

const buildChartDataForSite = (siteData: IOutgoingPaidTrafficChartSiteData) => {
    const { data, dates, siteName, siteColor } = siteData;

    // Merge the two point arrays (pointDates and pointValues)
    // into a single array of objects with X,Y coordinates,
    // that represent the location on the chart.
    const pointsData = data.map((pointValue, index) => {
        // Format the point date to a unix timestamp, since we must provide
        // numerical values to the chart
        const pointDate = dates[index];
        const formattedDate = convertDateStringToUnix(pointDate);
        return { x: formattedDate, y: pointValue };
    });

    return {
        name: siteName,
        color: siteColor,
        data: pointsData,
    };
};

/**
 * Formats the given chart props into renderable chart data
 */
export const buildChartData = (sitesData: IOutgoingPaidTrafficChartSiteData[]) => {
    return sitesData.map((site) => buildChartDataForSite(site));
};

/**
 * Given a list of dates, generates a title of the format "from {firstDate} to {lastDate}"
 * assuming that the given list of dates is sorted.
 */
export const formatDatesRangeString = (pointDates: Date[], dateFormat = "MMM YYYY") => {
    if (!pointDates || pointDates.length <= 0) {
        return "";
    }

    // Format the first and the last dates
    const firstDate = dayjs(pointDates[0]).format(dateFormat);
    const lastDate = dayjs(pointDates[pointDates.length - 1]).format(dateFormat);

    // Check if the array contains a single date (and therefore the
    // first and last dates are equal), and format the message accordingly
    const hasSingleDate = pointDates.length === 1;

    return hasSingleDate ? `from ${firstDate}` : `from ${firstDate} to ${lastDate}`;
};
