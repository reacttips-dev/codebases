import WithTranslation from "components/WithTranslation/src/WithTranslation";
import React, { FC } from "react";
import { TileList } from "use-case/list/components/TileList/TileList";
import { useUseCaseTiles } from "use-case/list/components/useUseCaseTiles";
import * as SC from "./StyledComponents";

export const UseCaseList: FC = () => {
    const useCases = useUseCaseTiles();
    return (
        <WithTranslation>
            {(translate) => (
                <>
                    <SC.PageHeading>{translate("use_case_screen.list.title")}</SC.PageHeading>
                    <SC.PageDescription>
                        {translate("use_case_screen.list.description")}
                    </SC.PageDescription>
                    <TileList items={useCases} translate={translate} />
                </>
            )}
        </WithTranslation>
    );
};
