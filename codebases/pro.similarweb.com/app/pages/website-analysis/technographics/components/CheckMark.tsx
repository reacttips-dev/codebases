import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import { CheckMarkContainer } from "../styles";

export const CheckMark = ({ isChecked }: { isChecked: boolean }) => (
    <CheckMarkContainer>
        {isChecked && <SWReactIcons size="xs" iconName={"checked"} />}
    </CheckMarkContainer>
);
