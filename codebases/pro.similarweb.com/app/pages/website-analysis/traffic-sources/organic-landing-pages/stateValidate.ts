export const organicLandingPagesValidator = (toParams, swNavigator): boolean => {
    const isValidState = isValidStateParams(toParams);
    !isValidState && removeSelectedDomain(swNavigator);
    return isValidState;
};

const removeSelectedDomain = (swNavigator) => {
    // setTimeout in order to prevent the "$digest already in progress" error
    // by moving function execution to the end of the queue
    setTimeout(() => {
        swNavigator.applyUpdateParams({ selectedDomain: undefined });
    }, 0);
};

const isValidStateParams = ({ selectedDomain, key }) => {
    const selectedSites = key.split(",");
    return selectedDomain ? selectedSites.includes(selectedDomain) : true;
};
