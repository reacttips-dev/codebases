import * as React from "react";
import * as PropTypes from "prop-types";
import * as ReactDOM from "react-dom";
import * as _ from "lodash";

export class ItemContainer extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            // mode = view / edit
            mode: "view",
            isHovered: false,
            isFocus: false,
        };
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onTextChanged = this.onTextChanged.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    onMouseEnter(e) {
        this.setState({
            isHovered: true,
        });
    }

    onMouseLeave(e) {
        this.setState({
            isHovered: false,
        });
    }

    onFocus(e) {
        this.setState({
            isFocus: true,
            mode: "edit",
        });
    }

    onDelete() {
        this.props.removeItem();
    }

    onTextChanged(newItemText) {
        let { item } = this.props;
        this.props.onItemTextChanged(item, newItemText);
        this.setState({
            isFocus: false,
            mode: "view",
        });
    }

    render() {
        const { item, ListItemComponent, isValid } = this.props;
        const showPencil = this.state.isHovered && !this.state.isFocus;
        const isViewMode = this.state.mode === "view";
        return (
            <div
                className="list-item-container"
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
                {isViewMode ? (
                    <ViewWrapper
                        item={item}
                        isValid={isValid}
                        showPencil={showPencil}
                        ListItemComponent={ListItemComponent}
                        onFocus={this.onFocus}
                        onDelete={this.onDelete}
                    />
                ) : (
                    <EditWrapper
                        item={item}
                        ListItemComponent={ListItemComponent}
                        onTextChanged={this.onTextChanged}
                    />
                )}
            </div>
        );
    }

    static propTypes = {
        ListItemComponent: PropTypes.func.isRequired, // must provide item component
    };
}

const ViewWrapper = ({ item, showPencil, ListItemComponent, onFocus, onDelete, isValid }) => {
    return (
        <div
            style={{ display: "flex" }}
            onClick={onFocus}
            className={isValid ? "valid-item" : "invalid-item"}
        >
            <ListItemComponent item={item} isEditable={false} />
            {showPencil ? (
                <i className="sw-icon-edit customCategoriesWizard-editor-edit-domain-icon" />
            ) : null}
            <span className="delete-item">
                <i
                    className="customCategoriesWizard-editor-remove-domain sw-icon-delete"
                    onMouseUp={onDelete}
                />
            </span>
        </div>
    );
};

class EditWrapper extends React.Component<any, any> {
    private _input: HTMLElement;

    constructor(props) {
        super(props);
        this.onBlur = this.onBlur.bind(this);
        this.onInput = this.onInput.bind(this);
    }

    render() {
        const { item, ListItemComponent } = this.props;
        return (
            <span className="list-item-edit" onBlur={this.onBlur} onKeyPress={this.onInput}>
                <ListItemComponent item={item} isEditable={true} />
            </span>
        );
    }

    initInput() {
        this._input = $(ReactDOM.findDOMNode(this)).find("[contentEditable]")[0];
        this.autoFocus();
    }

    submit() {
        const newText = _.trim(this._input.innerText);
        this.props.onTextChanged(newText);
    }

    onInput(e) {
        if (e.key === "Enter") {
            this.submit();
        }
    }

    componentDidMount() {
        this.initInput();
    }

    componentDidUpdate() {
        this.initInput();
    }

    componentWillUnmount() {
        this._input = null;
    }

    onBlur() {
        this.submit();
    }

    autoFocus() {
        $(this._input).focus();
        this.setEndOfContenteditable(this._input);
    }

    setEndOfContenteditable(contentEditableElement) {
        let range,
            selection,
            document: any = window.document,
            body: any = document.body;
        if (document.createRange) {
            //Firefox, Chrome, Opera, Safari, IE 9+
            range = document.createRange(); //Create a range (a range is a like the selection but invisible)
            range.selectNodeContents(contentEditableElement); //Select the entire contents of the element with the range
            range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
            selection = window.getSelection(); //get the selection object (allows you to change selection)
            selection.removeAllRanges(); //remove any selections already made
            selection.addRange(range); //make the range you have just created the visible selection
        } else if (document.selection) {
            //IE 8 and lower
            range = body.createTextRange(); //Create a range (a range is a like the selection but invisible)
            range.moveToElementText(contentEditableElement); //Select the entire contents of the element with the range
            range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
            range.select(); //Select the range (make it the visible selection
        }
    }
}
