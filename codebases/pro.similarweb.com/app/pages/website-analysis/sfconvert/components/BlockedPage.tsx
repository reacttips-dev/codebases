import {
    HeaderContainer,
    IconContainer,
    BigCompare,
    BlockedContent,
    BlockedMessage,
    BlockedTitle,
} from "../style";
import { i18nFilter } from "filters/ngFilters";
import { Logout } from "./Logout";
import { SWlogo } from "pages/website-analysis/sfconvert/art/SW_logo_RGB";

export function BlockedPage({ swSettings }: { swSettings: Record<string, any> }) {
    return (
        <>
            <HeaderContainer>
                <IconContainer>
                    <SWlogo />
                </IconContainer>
            </HeaderContainer>
            <BlockedContent>
                <BlockedTitle>{i18nFilter()("salesforce.blocked.title")}</BlockedTitle>
                <BlockedMessage
                    dangerouslySetInnerHTML={{
                        __html: i18nFilter()("salesforce.blocked.message", {
                            // eslint-disable-next-line @typescript-eslint/camelcase
                            start_line: "<div>",
                            // eslint-disable-next-line @typescript-eslint/camelcase
                            end_line: "</div>",
                            email: swSettings.user.username,
                        }),
                    }}
                />

                <Logout swSettings={swSettings}>
                    <BigCompare>{i18nFilter()("salesforce.blocked.button")}</BigCompare>
                </Logout>
            </BlockedContent>
        </>
    );
}
