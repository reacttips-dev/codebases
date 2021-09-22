import * as React from "react";
import * as classNames from "classnames";

export class ListItemsTitle extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
        const { errorMessage, tracker } = this.props;
        if (errorMessage) {
            tracker.onError(errorMessage);
        }
    }

    render() {
        const {
            maxItems,
            itemsListTitle,
            itemsListType,
            currentListLength,
            errorMessage,
        } = this.props;
        return (
            <div className="customCategoriesWizard-editor-container list-items-container">
                <div className="customCategoriesWizard-editor-header">
                    <div className="customCategoriesWizard-editor-title u-alignLeft">
                        {itemsListTitle}
                    </div>
                    <div className="customCategoriesWizard-editor-counter u-alignRight">
                        <span
                            className={classNames({
                                "customCategoriesWizard-editor-counter-invalid":
                                    currentListLength > maxItems,
                            })}
                        >
                            <span>{currentListLength}</span>
                        </span>
                        <span>
                            {" / "}
                            {maxItems} {itemsListType}
                        </span>
                        {errorMessage ? (
                            <i
                                data-scss-tooltip={errorMessage}
                                className="customCategoriesWizard-invalid-icon customCategoriesWizard-editor-invalid-format iconInfo iconInfo--white u-alignRight scss-tooltip scss-tooltip--w"
                            >
                                !
                            </i>
                        ) : null}
                    </div>
                </div>
            </div>
        );
    }
}
