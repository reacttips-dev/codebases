import SWReactRootComponent from "decorators/SWReactRootComponent";
import React, { FC } from "react";
import { UseCaseLayout } from "../common/components/UseCaseLayout";
import { UseCaseList } from "./components/UseCaseList";

export const UseCaseListPage: FC = () => (
    <UseCaseLayout>
        <UseCaseList />
    </UseCaseLayout>
);

SWReactRootComponent(UseCaseListPage, "UseCaseListPage");
