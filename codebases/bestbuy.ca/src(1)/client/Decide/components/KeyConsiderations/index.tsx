import * as React from "react";
import * as styles from "./style.css";
import {FormattedMessage, injectIntl, InjectedIntlProps} from "react-intl";
import messages from "./translations/messages";
import {isValidAttributeValue} from "./util";
import Attribute, {AttributeProps} from "./components/Attribute";

export interface KeyConsiderationsContainerProps {
    className?: string;
    appendToHeading?: string | React.ReactNode;
    description: string | React.ReactNode;
    children: React.ReactChildren | React.ReactNode;
}

export interface KeyConsiderations {
    quality: number;
    value: number;
    easeOfUse: number;
}

export type ReadKeyConsiderationsProps = KeyConsiderations;
export type EditKeyConsiderationsProps = Partial<KeyConsiderations>;

export interface AttributeGroupProps extends EditKeyConsiderationsProps {
    className?: string;
}
export interface KeyConsiderationsProps extends KeyConsiderations {
    isEditable?: boolean;
}

export type KeyConsiderationsAttributeProps = Pick<
    AttributeProps,
    "preselectedTile" | "isSelectable" | "clearButtonLabel"
> &
    InjectedIntlProps;

export const KeyConsiderationsContainer: React.FC<KeyConsiderationsContainerProps> = ({
    appendToHeading,
    children,
    className,
    description,
}) => (
    <div data-automation={"key-considerations-container"} className={className}>
        <h3 className={styles.heading}>
            <FormattedMessage {...messages.heading} />
            {appendToHeading}
        </h3>
        <p className={styles.description}>{description}</p>
        {children}
    </div>
);

export const ValueAttribute = injectIntl<KeyConsiderationsAttributeProps>(({intl, ...rest}) => {
    const ariaLabels = {
        clearButton: intl.formatMessage(messages.clearValue),
        tiles: [
            intl.formatMessage(messages.valuePoor),
            intl.formatMessage(messages.valueFair),
            intl.formatMessage(messages.valueAverage),
            intl.formatMessage(messages.valueGood),
            intl.formatMessage(messages.valueExcellent),
        ],
    };

    return (
        <Attribute
            name="keyConsiderationValue"
            title={intl.formatMessage(messages.value)}
            ariaLabels={ariaLabels}
            {...rest}
        />
    );
});

export const QualityAttribute = injectIntl<KeyConsiderationsAttributeProps>(({intl, ...rest}) => {
    const ariaLabels = {
        clearButton: intl.formatMessage(messages.clearQuality),
        tiles: [
            intl.formatMessage(messages.qualityPoor),
            intl.formatMessage(messages.qualityFair),
            intl.formatMessage(messages.qualityAverage),
            intl.formatMessage(messages.qualityGood),
            intl.formatMessage(messages.qualityExcellent),
        ],
    };

    return (
        <Attribute
            name="keyConsiderationQuality"
            title={intl.formatMessage(messages.quality)}
            ariaLabels={ariaLabels}
            {...rest}
        />
    );
});

export const EaseOfUseAttribute = injectIntl<KeyConsiderationsAttributeProps>(({intl, ...rest}) => {
    const ariaLabels = {
        clearButton: intl.formatMessage(messages.clearEaseOfUse),
        tiles: [
            intl.formatMessage(messages.easeOfUsePoor),
            intl.formatMessage(messages.easeOfUseFair),
            intl.formatMessage(messages.easeOfUseAverage),
            intl.formatMessage(messages.easeOfUseGood),
            intl.formatMessage(messages.easeOfUseExcellent),
        ],
    };

    return (
        <Attribute
            name="keyConsiderationEaseOfUse"
            title={intl.formatMessage(messages.easeOfUse)}
            ariaLabels={ariaLabels}
            {...rest}
        />
    );
});

export const AttributeGroup: React.FC<AttributeGroupProps> = ({
    className,
    easeOfUse,
    quality,
    value,
    ...attributePropsForEdit
}) => (
    <div className={className}>
        <QualityAttribute preselectedTile={quality} {...attributePropsForEdit} />
        <ValueAttribute preselectedTile={value} {...attributePropsForEdit}/>
        <EaseOfUseAttribute preselectedTile={easeOfUse} {...attributePropsForEdit}/>
    </div>
);

export const ReadKeyConsiderations: React.FC<ReadKeyConsiderationsProps> = ({quality, value, easeOfUse}) => {
    if (!isValidAttributeValue(quality) && !isValidAttributeValue(value) && !isValidAttributeValue(easeOfUse)) {
        return null;
    }

    const description = <FormattedMessage {...messages.description} />;

    return (
        <KeyConsiderationsContainer description={description}>
            <AttributeGroup
                quality={quality}
                value={value}
                easeOfUse={easeOfUse}
            />
        </KeyConsiderationsContainer>
    );
};

export const EditKeyConsiderations: React.FC<EditKeyConsiderationsProps> = ({quality, value, easeOfUse}) => {
    const appendToHeading = (
        <span>
            <FormattedMessage {...messages.headingOptional} />
        </span>
    );

    const description = <FormattedMessage {...messages.formDescription} />;
    const attributePropsForEdit = {
        isSelectable: true,
        clearButtonLabel: <FormattedMessage {...messages.clear} />,
        rangeLabels: {
            min: <FormattedMessage {...messages.poor} />,
            max: <FormattedMessage {...messages.excellent} />,
        },
    };

    return (
        <KeyConsiderationsContainer
            className={styles.keyConsiderationsContainer}
            appendToHeading={appendToHeading}
            description={description}>
            <AttributeGroup
                quality={quality}
                value={value}
                easeOfUse={easeOfUse}
                {...attributePropsForEdit}
            />
        </KeyConsiderationsContainer>
    );
};

const KeyConsiderations: React.FC<KeyConsiderationsProps> = ({isEditable, ...rest}) =>
    isEditable ? <EditKeyConsiderations {...rest} /> : <ReadKeyConsiderations {...rest} />;

export default KeyConsiderations;
