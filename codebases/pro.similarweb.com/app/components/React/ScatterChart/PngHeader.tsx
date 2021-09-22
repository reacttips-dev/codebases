import { PngHeader as PngHeaderInner } from "UtilitiesAndConstants/UtilitiesComponents/PngHeader";
import { Text } from "./Styled";
import styled from "styled-components";

const TextContainer = styled.div`
    padding: 20px;
`;

const PngHeaderContainer = styled.div`
    display: none;
    @media print {
        display: block;
    }
`;
export const PngHeader = (props) => {
    const { xVertical, yVertical } = props;
    return (
        <PngHeaderContainer>
            <PngHeaderInner {...props} />
            <TextContainer>
                <Text>
                    {yVertical} vs. {xVertical}
                </Text>
            </TextContainer>
        </PngHeaderContainer>
    );
};
