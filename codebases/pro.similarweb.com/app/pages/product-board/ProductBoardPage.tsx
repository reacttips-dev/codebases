import React, { FC, useState, useEffect } from "react";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import styled from "styled-components";

const ProductBoardFrame = styled.iframe`
    width: 100%;
    height: 100vh;
`;

type SolutionType = "dmi" | "ri";
interface ProductBoardPageProps {
    solution: SolutionType;
}

const ProductBoardPage: React.FC<ProductBoardPageProps> = ({ solution = "dmi" }) => {
    const [frameUrl, setFrameUrl] = useState(null);

    useEffect(() => {
        const fetchUrl = async () => {
            const response = await fetch(`/gw/product-board-sso?sol=${solution}`, {
                credentials: "include",
            });
            let urlWithToken = await response.text();
            setFrameUrl((urlWithToken += "&hide_logo=1"));
        };

        fetchUrl();
    }, []);

    if (!frameUrl) {
        return null;
    }

    return <ProductBoardFrame src={frameUrl} frameBorder="0"></ProductBoardFrame>;
};

export default ProductBoardPage;
SWReactRootComponent(ProductBoardPage, "ProductBoardPage");
