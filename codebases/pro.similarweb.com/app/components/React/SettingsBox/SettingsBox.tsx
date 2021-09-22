import * as classNames from "classnames";
import * as React from "react";
import { StatelessComponent } from "react";
import { Title } from "@similarweb/ui-components/dist/title";
import { Box } from "@similarweb/ui-components/dist/box";
import { Button } from "@similarweb/ui-components/dist/button";
import { i18nFilter } from "filters/ngFilters";

export const SettingsBox: StatelessComponent<any> = ({
    title,
    canSave = true,
    isSaving = false,
    onSave,
    onClose,
    boxClass,
    children,
}) => {
    const boxClasses = classNames("SettingsBox", boxClass);
    const buttonClass = classNames("u-uppercase", { "Button--loading": isSaving });

    return (
        <div className="perspective">
            <Box className={boxClasses}>
                <i className="sw-icon-close-thin" onClick={onClose} />
                <Title className="settings-title">{title}</Title>
                {children}
                <Button
                    height={36}
                    width={196}
                    className={buttonClass}
                    isDisabled={!canSave}
                    onClick={onSave}
                >
                    {i18nFilter()("shared.save")}
                </Button>
            </Box>
        </div>
    );
};
SettingsBox.displayName = "SettingsBox";
