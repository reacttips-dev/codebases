export const getAvailableGranularities = (durationObj) => {
    const durationRaw = durationObj?.raw;
    const monthDiff = durationRaw.to.diff(durationRaw.from, "month");
    return [
        {
            title: "D",
            disabled: true,
            index: 0,
            value: "Daily",
        },
        {
            title: "W",
            disabled: false,
            index: 1,
            value: "Weekly",
        },
        {
            title: "M",
            disabled: monthDiff < 1,
            index: 2,
            value: "Monthly",
        },
    ];
};
