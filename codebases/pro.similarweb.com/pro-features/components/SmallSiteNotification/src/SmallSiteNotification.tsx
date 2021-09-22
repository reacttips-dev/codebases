import React, { FunctionComponent } from "react";
import { Button } from "@similarweb/ui-components/dist/button";
import {
    Container,
    Content,
    CustomButtonsGroup,
    Text,
    Title,
} from "components/SmallSiteNotification/src/StyledComponents";
import WithTranslation from "components/WithTranslation/src/WithTranslation";
import styled from "styled-components";
interface ISmallSiteNotificationProps {
    site: string;
    onContinueClick: () => void;
    onEnterClick: () => void;
}
const ContinueButton = styled(Button)`
    margin: 5px 0;
`;

const RemoveButton = styled(Button)`
    margin: 5px 16px 5px 0;
`;

export const SmallSiteNotification: FunctionComponent<ISmallSiteNotificationProps> = ({
    site,
    onContinueClick,
    onEnterClick,
}) => {
    return (
        <WithTranslation>
            {(translate) => (
                <Container>
                    <Content>
                        <Title>
                            <span>
                                {site}{" "}
                                {translate(
                                    "workspace.marketing.onboarding.smallsite_notification.title",
                                )}
                            </span>
                        </Title>
                        <Text>
                            {translate(
                                "workspace.marketing.onboarding.smallsite_notification.text.pre_link",
                            )}
                            &nbsp;
                            <a
                                href="https://support.similarweb.com/hc/en-us/articles/360002219177-Reliable-Data-Estimations"
                                target="_blank"
                            >
                                {translate("global.labels.learnMore")}
                            </a>
                            &nbsp;
                            {translate(
                                "workspace.marketing.onboarding.smallsite_notification.text.post_link",
                            )}
                        </Text>
                    </Content>
                    <CustomButtonsGroup>
                        <ContinueButton type={"flatDark"} onClick={onContinueClick}>
                            {translate(
                                "workspace.marketing.onboarding.smallsite_notification.button.continue",
                            )}
                        </ContinueButton>
                        <RemoveButton type={"flat"} onClick={onEnterClick}>
                            {translate(
                                "workspace.marketing.onboarding.smallsite_notification.button.remove",
                            )}
                        </RemoveButton>
                    </CustomButtonsGroup>
                </Container>
            )}
        </WithTranslation>
    );
};
