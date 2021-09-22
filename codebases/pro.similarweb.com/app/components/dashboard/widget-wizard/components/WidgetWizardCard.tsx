import { StatelessComponent } from "react";
import * as React from "react";
import * as classNames from "classnames";
import { Button } from "@similarweb/ui-components/dist/button";
import { i18nFilter } from "../../../../filters/ngFilters";

const WidgetWizardCard: StatelessComponent<any> = ({
    title,
    className,
    description,
    buttonText,
    imageUrl,
    onClick,
    isSelected,
    onMouseOver,
    isDisabled,
}) => {
    const label = i18nFilter()(buttonText);
    const cardClassNames = classNames(className, {
        "react-wizard-cards-container-card--hover": isSelected,
    });
    return (
        <li onMouseOver={onMouseOver} className={cardClassNames} onClick={onClick}>
            <div className="react-wizard-card-text">
                <strong>{title}</strong>
                <p>{description}</p>
            </div>
            <div className="react-wizard-card-image">
                <img src={imageUrl} />
                <div className="react-wizard-card-image-overlay">
                    {isDisabled ? (
                        <Button type="upsell" onClick={onClick}>
                            {label}
                        </Button>
                    ) : (
                        <Button type="primary" onClick={onClick}>
                            {label}
                        </Button>
                    )}
                </div>
            </div>
        </li>
    );
};
export default WidgetWizardCard;
