import {defineMessages} from "react-intl";

const path = "components.reviewsSortDropdown.";

export default defineMessages({
    sortAriaLabel: {id: `${path}sortAriaLabel`, defaultMessage: "Sort By"},
    newest: {id: `${path}newest`, defaultMessage: "Newest"},
    oldest: {id: `${path}oldest`, defaultMessage: "Oldest"},
    highestRating: {id: `${path}highestRating`, defaultMessage: "Highest Rating"},
    lowestRating: {id: `${path}lowestRating`, defaultMessage: "Lowest Rating"},
    helpfulness: {id: `${path}helpfulness`, defaultMessage: "Helpfulness"},
    mostRelevant: {id: `${path}mostRelevant`, defaultMessage: "Most Relevant"},
});
