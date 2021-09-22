const getWeekDayIndex = (dayOfWeek: string, lang: Language): number | undefined => {
    const daysInEnglish: {
        [key: string]: number;
    } = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
    };

    const daysInFrench: {
        [key: string]: number;
    } = {
        dimanche: 0,
        lundi: 1,
        mardi: 2,
        mercredi: 3,
        jeudi: 4,
        vendredi: 5,
        samedi: 6,
    };

    // TODO: This is a workaround for the StoreLocatorPage. When switching languages,
    // it does not make a call to location api to get the FR store hours.
    let index = daysInEnglish[dayOfWeek.toLowerCase()];

    if (typeof index === "undefined") {
        index = daysInFrench[dayOfWeek.toLowerCase()];
    }

    return index;
};

export default getWeekDayIndex;
