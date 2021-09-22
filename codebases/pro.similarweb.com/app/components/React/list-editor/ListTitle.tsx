import * as React from "react";
import * as classNames from "classnames";
import { TITLE_MAX_LENGTH } from "../../../pages/keyword-analysis/KeywordGroupEditorHelpers";

export class ListTitle extends React.Component<any, any> {
    private _input: HTMLInputElement;
    constructor(props, state) {
        super(props, state);
        this.onInputMouseEnter = this.onInputMouseEnter.bind(this);
        this.onInputFocus = this.onInputFocus.bind(this);
        this.onInputMouseLeave = this.onInputMouseLeave.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            inputMouseEnter: false,
            inputFocus: true,
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this._input.focus();
        }, 200);
    }

    onInputMouseEnter() {
        this.setState({
            inputMouseEnter: true,
        });
    }

    onInputMouseLeave() {
        this.setState({
            inputMouseEnter: false,
        });
    }

    onInputFocus() {
        this.setState({
            inputFocus: true,
        });
    }

    onSubmit(e) {
        e.preventDefault();
        this.onTitleChanged(this._input.value);
    }

    onTitleChanged(newTitle) {
        this.setState(
            {
                inputFocus: false,
            },
            () => this.props.onListTitleChange(newTitle),
        );
    }

    onInputChange = (e) => {
        this.onTitleChanged(e.target.value);
        this.props.onListTitleInput(e);
    };

    trackError(errorMessage) {
        this.props.tracker.onError(errorMessage);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.title !== this.props.title) {
            const { errorMessage, isValid } = this.props.title;
            const showError = !isValid && errorMessage && !this.state.inputFocus;
            if (showError) {
                this.trackError(errorMessage);
            }
        }
    }

    render() {
        const { titleText, placeHolderText, inputMaxLength, title } = this.props;
        const showPencilIcon = this.state.inputMouseEnter && !this.state.inputFocus;
        const { isValid, errorMessage, text } = title;
        const showError = !isValid && !this.state.inputFocus;
        return (
            <div className={classNames("items-list-title", { "invalid-title": !isValid })}>
                <form style={{ margin: 0 }} onSubmit={this.onSubmit}>
                    <div
                        onMouseLeave={this.onInputMouseLeave}
                        onMouseEnter={this.onInputMouseEnter}
                        className={classNames("customCategoriesWizard-name", {
                            "customCategoriesWizard-name-focused": !showPencilIcon,
                        })}
                    >
                        <div className="customCategoriesWizard-name-input">
                            <input
                                ref={(input) => (this._input = input)}
                                onFocus={this.onInputFocus}
                                onChange={this.onInputChange}
                                tabIndex={1}
                                maxLength={inputMaxLength}
                                type="text"
                                placeholder={placeHolderText}
                                value={text || ""}
                            />
                            <div className="customCategoriesWizard-name-input-bar"></div>
                        </div>
                        {showError ? (
                            <i
                                data-scss-tooltip={errorMessage}
                                className="customCategoriesWizard-invalid-icon customCategoriesWizard-editor-invalid-format iconInfo iconInfo--white u-alignRight scss-tooltip scss-tooltip--w"
                            >
                                !
                            </i>
                        ) : null}
                        {showPencilIcon && !showError ? (
                            <i className="customCategoriesWizard-icon sw-icon-edit" />
                        ) : null}
                    </div>
                </form>
            </div>
        );
    }

    static defaultProps = {
        inputMaxLength: TITLE_MAX_LENGTH,
    };
}
