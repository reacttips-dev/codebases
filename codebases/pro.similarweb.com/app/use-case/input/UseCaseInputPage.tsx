import SWReactRootComponent from "decorators/SWReactRootComponent";
import React, { FC } from "react";
import { InputScreenParams } from "use-case/common/types";
import { UseCaseLayout } from "../common/components/UseCaseLayout";
import { UseCaseInput } from "./components/UseCaseInput";

type QueryParam = string | string[] | null;

type QueryParams<T extends string> = {
    [key in T]?: QueryParam;
};

interface IUseCaseInputPage {
    routeParams: QueryParams<
        | "backUrl"
        | "websiteTitle"
        | "websiteSubtitle"
        | "websiteCta"
        | "competitorsTitle"
        | "competitorsSubTitle"
        | "competitorsCta"
    >;
}

const stringFromQueryParam = (param: QueryParam): string | undefined =>
    Array.isArray(param) ? stringFromQueryParam(param[0]) : param || undefined;

export const UseCaseInputPage: FC<IUseCaseInputPage> = ({
    routeParams: {
        backUrl,
        websiteTitle,
        websiteSubtitle,
        websiteCta,
        competitorsTitle,
        competitorsSubTitle,
        competitorsCta,
    },
}) => {
    const textConfig: InputScreenParams = {
        website: {
            title: stringFromQueryParam(websiteTitle),
            subtitle: stringFromQueryParam(websiteSubtitle),
            cta: stringFromQueryParam(websiteCta),
        },
        competitors: {
            title: stringFromQueryParam(competitorsTitle),
            subtitle: stringFromQueryParam(competitorsSubTitle),
            cta: stringFromQueryParam(competitorsCta),
        },
    };

    return (
        <UseCaseLayout>
            <UseCaseInput
                backUrlTemplate={decodeURIComponent(stringFromQueryParam(backUrl) || "")}
                textConfig={textConfig}
            />
        </UseCaseLayout>
    );
};

SWReactRootComponent(UseCaseInputPage, "UseCaseInputPage");
