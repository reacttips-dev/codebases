import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import React, { FC, useCallback, useMemo } from "react";
import urlTemplate from "url-template";
import {
    IUseCaseInputFormValues,
    UseCaseInputForm,
} from "use-case/input/components/UseCaseInputForm";
import { InputScreenParams } from "use-case/common/types";

interface IUseCaseInput {
    backUrlTemplate?: string;
    textConfig: InputScreenParams;
}

export const UseCaseInput: FC<IUseCaseInput> = ({ backUrlTemplate = "", textConfig }) => {
    const swNavigator: SwNavigator = Injector.get("swNavigator");
    const backUrlBuilder = useMemo(() => urlTemplate.parse(backUrlTemplate), [backUrlTemplate]);
    const requiresCompetitors = backUrlTemplate.includes("{competitors}");

    const onSubmit = useCallback(
        ({ website, competitors }: IUseCaseInputFormValues) => {
            const backUrl = decodeURIComponent(
                backUrlBuilder.expand({
                    website,
                    ...(!!competitors && { competitors: competitors.join(",") }),
                }),
            );

            window.location.href = backUrl;
        },
        [backUrlBuilder],
    );

    const onGoBack = useCallback(() => {
        swNavigator.go("useCase-list");
    }, []);

    return (
        <UseCaseInputForm
            onGoBack={onGoBack}
            onSubmit={onSubmit}
            requireCompetitors={requiresCompetitors}
            textConfig={textConfig}
        />
    );
};
