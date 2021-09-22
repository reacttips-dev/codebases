import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import { InsightCardWrapper } from "./InsightCardsStyles";

export const InsightCardLoader = () => {
    return (
        <InsightCardWrapper>
            <PixelPlaceholderLoader width={"268px"} height={"174px"} id={"inner-loader"} />
        </InsightCardWrapper>
    );
};
