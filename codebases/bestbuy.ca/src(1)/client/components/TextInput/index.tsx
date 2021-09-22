import * as React from "react";
import {InjectedIntlProps, injectIntl} from "react-intl";
import * as styles from "./style.css";
import messages from "./translations/messages";

interface TextInputProps {
    name: string;
    onChangeHandler: (text: string, name: any) => void;
    isMultiline?: boolean;
    label?: string;
    placeholder?: string;
    defaultValue?: string;
    maxLength?: number;
    hasErrors?: boolean;
    errorMessage?: string;
}

interface State {
    textCount: number;
    hasErrors: boolean;
    errorMessage?: string;
}

interface TextProps {
    defaultValue: string;
    onChange: (event) => void;
    placeholder: string;
    className: string;
    name: string;
}

export class TextInput extends React.PureComponent<TextInputProps & InjectedIntlProps, State> {
    private textProps: TextProps;

    constructor(props) {
        super(props);
        this.state = {
            errorMessage: this.props.errorMessage,
            hasErrors: this.props.hasErrors,
            textCount: this.props.defaultValue ? this.props.defaultValue.length : 0,
        };

        this.textProps = {
            className: styles.input,
            defaultValue: this.props.defaultValue,
            name: this.props.name,
            onChange: (event) => {
                const text = event.target.value;
                const name = event.target.name;

                if (this.props.maxLength) {
                    const isAtMaxLength = !!(text.length > this.props.maxLength);

                    // Max length error takes precedence over passed down error
                    this.setState({
                        errorMessage: isAtMaxLength
                            ? this.props.intl.formatMessage(messages.overMaxLength)
                            : this.props.errorMessage,
                        hasErrors: isAtMaxLength || this.props.hasErrors,
                        textCount: text.length,
                    });
                }

                this.props.onChangeHandler(text, name);
            },
            placeholder: this.props.placeholder,
        };
    }

    public componentWillMount() {
        if (this.props.defaultValue && this.props.defaultValue.length > this.props.maxLength) {
            this.setState({
                errorMessage: this.props.intl.formatMessage(messages.overMaxLength),
                hasErrors: true,
            });
        }
    }

    public componentWillReceiveProps(nextProps) {
        if (this.props.hasErrors !== nextProps.hasErrors) {
            this.setState({hasErrors: nextProps.hasErrors});
        }

        if (this.props.errorMessage !== nextProps.errorMessage) {
            this.setState({errorMessage: nextProps.errorMessage});
        }
    }

    public render() {
        return (
            <div className={this.state.hasErrors ? styles.error : ""}>
                {this.props.label && <div className={styles.label}>{this.props.label}</div>}
                {this.props.isMultiline ? (
                    // Ignoring error: "Input elements must include default, place-holding characters if empty" because textProps includes placeholder and/or this TextInput component is too generic to provide a global placeholder.
                    /* tslint:disable-next-line:react-a11y-input-elements */
                    <textarea {...this.textProps} />
                ) : (
                    /* tslint:disable-next-line:react-a11y-input-elements */
                    <input type="text" {...this.textProps} />
                )}
                {(this.props.maxLength || this.state.hasErrors) && (
                    <div className={styles.messageContainer}>
                        <span>{this.state.hasErrors && this.state.errorMessage}</span>
                        <span>{this.props.maxLength && `${this.state.textCount} / ${this.props.maxLength}`}</span>
                    </div>
                )}
            </div>
        );
    }
}

export default injectIntl<TextInputProps>(TextInput);
