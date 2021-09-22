/* eslint-disable @typescript-eslint/camelcase */
import { BetaLabel } from "components/BetaLabel/BetaLabel";
import { i18nFilter } from "filters/ngFilters";
import _ from "lodash";
import dayjs from "dayjs";
import { BoxContainer } from "pages/app performance/src/page/single/usage section/styledComponents";
import { FeedCardNews } from "pages/workspace/common components/FeedCard/FeedCardNews";
import { RanksWrapper } from "pages/workspace/common/WebsiteExpandData/Tabs/StyledComponents";
import { useContext } from "react";
import { compose } from "redux";
import styled from "styled-components";
import { FEED_FEEDBACK_NEGATIVE } from "../../../../../app/pages/workspace/common/consts";
import {
    IFeedItem,
    INewsFeedItem,
    IWebsiteFeedItem,
    IWebsiteMmxFeedItem,
} from "../../../../../app/pages/workspace/common/types";
import { WorkspaceContext } from "../WorkspaceContext";
import { CardListContainer, CardListDataDate } from "./elements";
import { FeedCard } from "./FeedCard";

const metricsOrder = {
    monthly_total_visits_change: 0,
    desktop_mmx_outlier_change: {
        direct: 1,
        organic_search: 2,
        paid_search: 3,
        referrals: 4,
        social: 5,
        display_ads: 6,
        mail: 7,
    },
};

const orderAndGroupCards = (cards: IWebsiteFeedItem[]) =>
    _.groupBy(
        cards.sort((c1, c2) => {
            const d1 = dayjs.utc(c1.DataDate).toDate();
            const d2 = dayjs.utc(c2.DataDate).toDate();
            return d1 < d2 ? 1 : d1 > d2 ? -1 : 0;
        }),
        (card) => dayjs.utc(card.DataDate).format("MMMM YYYY"),
    );

interface IGroupCardsDate {
    [date: string]: IFeedItem[];
}

function isMmxFeedCard(card: IFeedItem): card is IWebsiteMmxFeedItem {
    return card.Metric === "desktop_mmx_outlier_change";
}

function isIWebsiteFeedCard(card): card is IWebsiteFeedItem {
    return (
        card.Metric === "desktop_mmx_outlier_change" ||
        card.Metric === "monthly_total_visits_change"
    );
}

const renderFeedCardList = (cardGroups: IGroupCardsDate) => {
    const { getCountryById } = useContext(WorkspaceContext);
    return _.map(cardGroups, (cards, formattedDate) => {
        const visibleCards = cards.filter(
            (card) =>
                !card.FeedbackItemFeedback ||
                !card.FeedbackItemFeedback.Type ||
                card.FeedbackItemFeedback.Type !== FEED_FEEDBACK_NEGATIVE,
        );
        return (
            <div key={formattedDate}>
                <CardListDataDate visible={visibleCards.length > 0}>
                    {formattedDate}
                </CardListDataDate>
                {_.sortBy(cards, (card) => {
                    const countryRes =
                        card.Country === 999 || card.Country === -1
                            ? "0"
                            : (getCountryById(card.Country)?.text as IWebsiteFeedItem);
                    const metricRes = isMmxFeedCard(card)
                        ? metricsOrder[card.Metric][card.Channel]
                        : metricsOrder[card.Metric];
                    return [countryRes, metricRes];
                }).map((card) =>
                    isIWebsiteFeedCard(card) ? (
                        <FeedCard key={card.Id} {...card} />
                    ) : (
                        <FeedCardNews key={card.Id} {...(card as INewsFeedItem)} />
                    ),
                )}
            </div>
        );
    });
};

interface IFeedCardsListProps {
    cards: IWebsiteFeedItem[];
}

const Container = styled(BoxContainer)``;
const NewsWrapper = styled(RanksWrapper)`
    margin-bottom: 12px;
    ${Container} {
        height: 36px;
        margin: 0;
        padding: 0;
        background-color: initial;
        padding-left: 4px;
        align-items: center;
        width: auto;
    }
`;

const BetaText = styled.span`
    margin-left: 8px;
    line-height: 20px;
    font-size: 14px;
`;
const BetaNews = () => (
    <NewsWrapper data-automation="news-beta">
        <Container>
            <BetaLabel />
            <BetaText>{i18nFilter()("company_news.beta.text")}</BetaText>
        </Container>
    </NewsWrapper>
);

export const FeedCardsList = ({ cards }: IFeedCardsListProps) => {
    const itemsToRender = compose(renderFeedCardList, orderAndGroupCards)(cards);
    const hasNewsCard = !!cards.filter((card) => card.Metric === "news").length;

    return (
        <CardListContainer>
            {hasNewsCard && <BetaNews />}
            {itemsToRender}
        </CardListContainer>
    );
};
