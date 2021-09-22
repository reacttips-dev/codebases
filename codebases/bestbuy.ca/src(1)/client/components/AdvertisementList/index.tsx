import * as React from "react";
import * as styles from "./style.css";
import {IBrowser as ScreenSize} from "redux-responsive";
import {CustomContentList} from "models";

import {AdSlot as GoogleAdSlot} from "components/Advertisement";

export interface AdvertisementListProps {
    content: CustomContentList;
    screenSize: ScreenSize;
    language: Language;
    isMobileApp?: boolean;
    onAdItemsHaveBeenHidden?: (shouldShowParentBlock: boolean) => void;
}

export const AdvertisementList = (props: AdvertisementListProps) => {
    const [itemState, setItemState] = React.useState({});
    const updateItemState = (index, value) => {
        if (itemState[index] !== value) {
            setItemState({
                ...itemState,
                [index]: value,
            });
        }
    };

    const numberOfHiddenItems = Object.values(itemState).filter((state) => state === false).length;
    if (props.onAdItemsHaveBeenHidden && numberOfHiddenItems !== 0 && props.content.customContentList.length) {
        const areAllItemsHidden = numberOfHiddenItems !== props.content.customContentList.length;
        props.onAdItemsHaveBeenHidden(areAllItemsHidden);
    }

    const adSlots = props.content.customContentList.map((item, index) => {
        const containerDisplayStyle = itemState[index] === false ? "none" : "inline-block";
        const updateCurrentItemState = (value) => updateItemState(index, value);
        const containerId = item.values && item.values.id;
        return (
            <div
                key={index}
                className={`${styles.advertisementListItemWrapper}`}
                style={{display: containerDisplayStyle}}>
                <GoogleAdSlot containerId={containerId} onAdAvailabilityChange={updateCurrentItemState} />
            </div>
        );
    });

    return <div className={`${styles.advertisementListContainer}`}>{adSlots}</div>;
};

export default AdvertisementList;
