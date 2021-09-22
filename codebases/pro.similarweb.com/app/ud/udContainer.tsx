import { Button } from "@similarweb/ui-components/dist/button";
import { OnOffSwitch } from "@similarweb/ui-components/dist/on-off-switch";
import { CircularLoader } from "components/React/CircularLoader";
import * as React from "react";
import { useEffect, useState } from "react";
import {
    BoxContainer,
    FeatureLabel,
    Header,
    LoaderContainer,
    StyledFlexRow,
    StyledFlexRowAlignRight,
} from "ud/StyledComponents";
import UDService from "./UdService";

const udService = new UDService();

const circularLoaderOptions = {
    svg: {
        stroke: "#dedede",
        strokeWidth: "4",
        r: 12,
        cx: "50%",
        cy: "50%",
    },
    style: {
        width: 32,
        height: 32,
        marginLeft: "15px",
    },
};

export const UdContainer: React.FC<any> = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [featureFlags, setFeatureFlags] = useState({});

    useEffect(() => {
        document.title = "Similarweb Pro Features";
        setIsLoading(true);
        const flagsResponse = udService.getFeatureFlags();
        flagsResponse
            .then((flags) => {
                setFeatureFlags(flags);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);
    const onSwitchChangeValue = ({ label, value }) => {
        setFeatureFlags({
            ...featureFlags,
            [label]: !value,
        });
    };

    const saveFeatures = () => {
        setIsLoading(true);
        const flagsResponse = udService.saveFeatureFlags(featureFlags);
        flagsResponse.finally(() => {
            setIsLoading(false);
        });
    };

    return (
        <BoxContainer>
            <StyledFlexRow style={{ marginBottom: "20px" }}>
                <Header>UD FEATURES:</Header>
                <span style={{ fontSize: "14px" }}>
                    {" "}
                    {window.similarweb.settings.user.username}
                </span>
            </StyledFlexRow>
            {isLoading ? (
                <LoaderContainer>
                    <CircularLoader options={circularLoaderOptions} />
                </LoaderContainer>
            ) : (
                Object.entries(featureFlags).map((entry: any[]) => {
                    const label = entry[0];
                    const flagValue: boolean = entry[1] as boolean;
                    return (
                        <StyledFlexRow className={"row-container"} key={label}>
                            <FeatureLabel>{label}</FeatureLabel>
                            <OnOffSwitch
                                onClick={(e) => onSwitchChangeValue({ label, value: flagValue })}
                                isSelected={entry[1]}
                            />
                        </StyledFlexRow>
                    );
                })
            )}
            <StyledFlexRowAlignRight>
                <Button type="primary" isDisabled={isLoading} onClick={saveFeatures}>
                    Save
                </Button>
            </StyledFlexRowAlignRight>
        </BoxContainer>
    );
};
