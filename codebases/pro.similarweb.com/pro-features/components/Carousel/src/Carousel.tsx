import * as React from "react";
import { CarouselContainer } from "@similarweb/ui-components/dist/carousel";
import { SWReactIcons } from "@similarweb/icons";
import {
    CarouselButtonIconContainer,
    CarouselButtonLeft,
    CarouselButtonRight,
    CarouselContainerWrapper,
} from "./Carousel.styles";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

interface ICarouselProps {
    margin: number;
    offset?: number;
    children: React.ReactNode[];
    forceHover?: boolean;
    isTable?: boolean;
    initialSelectedItem?: number;
    onSelectedItemChange?: (setSelectedItem: number) => void;
}

export const Carousel: React.FunctionComponent<ICarouselProps> = ({
    margin,
    offset = 0,
    forceHover,
    children,
    isTable,
    onSelectedItemChange,
    initialSelectedItem = 0,
}) => {
    const [selectedItem, setSelectedItem] = React.useState<number>(initialSelectedItem);
    const [totalSlidableItems, setTotalSlidableItems] = React.useState<number>(0);

    const changeSelectedItem = (direction, value) => {
        setSelectedItem(value);
        onSelectedItemChange && onSelectedItemChange(value);
        TrackWithGuidService.trackWithGuid("carousel", "click", { direction });
    };

    const next = () =>
        totalSlidableItems > 0 &&
        selectedItem < totalSlidableItems &&
        changeSelectedItem("next", selectedItem + 1);

    const prev = () => selectedItem > 0 && changeSelectedItem("prev", selectedItem - 1);

    const getTotalSlidableItems = (totalSlidableItems) => {
        setTotalSlidableItems(totalSlidableItems);
        !totalSlidableItems && setSelectedItem(0);
    };
    return (
        <CarouselContainerWrapper
            rightVisible={totalSlidableItems > 0 && selectedItem < totalSlidableItems}
            leftVisible={selectedItem > 0}
            forceHover={forceHover}
        >
            <CarouselContainer
                selectedItem={selectedItem}
                margin={margin}
                offset={offset}
                getTotalSlidableItems={getTotalSlidableItems}
            >
                {children}
            </CarouselContainer>
            <CarouselButtonLeft isTable={isTable} onClick={prev}>
                <CarouselButtonIconContainer>
                    <SWReactIcons iconName="arrow-left" />
                </CarouselButtonIconContainer>
            </CarouselButtonLeft>
            <CarouselButtonRight isTable={isTable} onClick={next}>
                <CarouselButtonIconContainer>
                    <SWReactIcons iconName="arrow-right" />
                </CarouselButtonIconContainer>
            </CarouselButtonRight>
        </CarouselContainerWrapper>
    );
};
