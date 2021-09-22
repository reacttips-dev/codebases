import * as React from "react";
import {Button, Form, Input, required} from "@bbyca/bbyca-components";
import * as styles from "./styles.css";
import {classname} from "utils/classname";
import {inRange} from "../../utils/validators";
import {injectIntl, InjectedIntlProps} from "react-intl";
import messages from "./translations/messages";

type OnSubmit = (type: string, e: React.FormEvent<HTMLFormElement>, data: any) => any;
type OnError = (type: string, data: any) => any;

const DateInput: React.FunctionComponent<{onSubmit: OnSubmit; onError: OnError} & InjectedIntlProps> = ({
    onSubmit,
    onError,
    intl,
}) => {
    const {formatMessage} = intl;
    const inputExtraProps = {
        extraAttrs: {
            inputMode: "numeric",
        },
    };

    return (
        <div className={styles.inputForm}>
            <Form onSubmit={onSubmit} onError={onError} scrollToErrors={false}>
                <div className={styles.dateInputs}>
                    <Input
                        {...inputExtraProps}
                        validators={[required, inRange(1900, new Date().getFullYear())]}
                        maxLength={4}
                        className={classname([styles.input, styles.year])}
                        name={"year"}
                        placeholder={formatMessage(messages.yearPlaceholder)}
                        formatter={"####"}
                    />
                    <Input
                        {...inputExtraProps}
                        validators={[required, inRange(1, 12)]}
                        maxLength={2}
                        className={styles.input}
                        name={"month"}
                        placeholder={formatMessage(messages.monthPlaceholder)}
                        formatter={"##"}
                    />
                    <Input
                        {...inputExtraProps}
                        validators={[required, inRange(1, 31)]}
                        maxLength={2}
                        className={styles.input}
                        name={"day"}
                        placeholder={formatMessage(messages.dayPlaceholder)}
                        formatter={"##"}
                    />
                </div>
                <Button type={"submit"} appearance={"secondary"}>
                    {formatMessage(messages.ctaText)}
                </Button>
            </Form>
        </div>
    );
};

export default injectIntl(DateInput);
