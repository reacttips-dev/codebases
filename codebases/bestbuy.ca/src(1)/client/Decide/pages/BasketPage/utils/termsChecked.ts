import SessionStorageProvider from "providers/SessionStorageProvider";

interface TermsValue {
    isTermsAndConditionsAccepted: boolean;
}

const itemName: string = "basketPage";
const itemValue = (val: boolean): TermsValue => ({isTermsAndConditionsAccepted: val});

const getTermsFromStorage = () => {
    const basketPageData = SessionStorageProvider.getItem("basketPage");
    return (basketPageData && basketPageData.isTermsAndConditionsAccepted) || false;
};

const setTermsOnStorage = (val: boolean): void => {
    SessionStorageProvider.setItem(itemName, itemValue(val));
};

export {getTermsFromStorage, setTermsOnStorage};
