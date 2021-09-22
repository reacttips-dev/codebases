import * as React from "react";
import { PrimaryBoxTitle } from "../../../../../../styled components/StyledBoxTitle/src/StyledBoxTitle";
import { numberAbbr } from "./formatters";
import Usage from "./Usage";

const gradientProps = {
    stop1Color: "rgba(56, 190, 214, 0.15)",
    stop2Color: "rgba(105, 224, 237, 0.05)",
    fillColor: "#38bed6",
};

const DailyActiveUsers: any = ({ data, title, tooltip }) => {
    const TitleComponent = () => <PrimaryBoxTitle tooltip={tooltip}>{title}</PrimaryBoxTitle>;
    return (
        <Usage
            title={title}
            TitleComponent={TitleComponent}
            formatValue={numberAbbr}
            data={data}
            gradientProps={gradientProps}
        />
    );
};

DailyActiveUsers.displayName = "DailyActiveUsers";
export default DailyActiveUsers;
