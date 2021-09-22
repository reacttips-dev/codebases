import React from "react";
import HomeLinksSectionContainer from "./HomeLinksSectionContainer";
import HomeRecentsTopCategory from "./HomeRecentsTopCategory";

const HomePageContent = () => {
    return (
        <div>
            <HomeRecentsTopCategory />
            <HomeLinksSectionContainer />
        </div>
    );
};

export default HomePageContent;
