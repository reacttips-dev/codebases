import React, { FC, ReactNode } from "react";
import { Header } from "use-case/common/components/Header/Header";

interface IUseCaseLayout {
    children: ReactNode;
}

export const UseCaseLayout: FC<IUseCaseLayout> = ({ children }) => (
    <>
        <Header />
        {children}
    </>
);
