import * as React from "react";
import {IBrowser as ScreenSize} from "redux-responsive";
import {FormattedMessage} from "react-intl";
import {SelectableCardOptions, SelectableCardsProps, SelectableCards} from "@bbyca/bbyca-components";

import {ActivationTypes} from "models";
import {classname, classIf} from "utils/classname";
import {CellPhoneCarrierID} from "models";

import messages from "./translations/messages";
import * as styles from "./styles.css";
import {ActivationOption, Carrier} from "./";
import {prepareSelectableCardsContent} from "../../utils/helper";

export interface SelectableCardsContainerProps {
    screenSize: ScreenSize;
    carrierID: CellPhoneCarrierID | "";
    isErrorState: boolean;
    setIsErrorState: (state: boolean) => void;
    onUserSelection: (activationType: ActivationTypes) => void;
    selectedCardId: string;
    enableUpgradeCheck: boolean;
    children?: React.ReactNode;
}
export const SelectableCardsContainer: React.FC<SelectableCardsContainerProps> = ({
    screenSize,
    enableUpgradeCheck,
    isErrorState,
    carrierID,
    setIsErrorState,
    onUserSelection,
    selectedCardId,
    children,
}) => {
    const isMobile = screenSize.lessThan.small;
    const cardsOptions = React.useMemo<SelectableCardOptions[]>(
        () => [
            prepareSelectableCardsContent(
                <ActivationOption
                    header={<FormattedMessage {...messages.activationTypeUpgradeOptionTitle} />}
                    body={
                        <FormattedMessage
                            {...messages.activationTypeUpgradeOptionBody}
                            values={{carrier: <Carrier carrierID={carrierID} />}}
                        />
                    }
                />,
                ActivationTypes.Upgrade,
            ),
            prepareSelectableCardsContent(
                <ActivationOption
                    header={<FormattedMessage {...messages.activationTypeAddLineOptionTitle} />}
                    body={
                        <FormattedMessage
                            {...messages.activationTypeAddLineOptionBody}
                            values={{carrier: <Carrier carrierID={carrierID} />}}
                        />
                    }
                />,
                ActivationTypes.AddDeviceToNewLine,
            ),
            prepareSelectableCardsContent(
                <ActivationOption
                    header={<FormattedMessage {...messages.activationTypeNewAccountOptionTitle} />}
                    body={
                        <FormattedMessage
                            {...messages.activationTypeNewAccountOptionBody}
                            values={{carrier: <Carrier carrierID={carrierID} />}}
                        />
                    }
                />,
                ActivationTypes.NewActivation,
            ),
        ],
        [isErrorState, carrierID],
    );

    const handleUserSelection = React.useCallback(
        (activationType: ActivationTypes) => {
            if (activationType) {
                setIsErrorState(false);
                onUserSelection(activationType);
            }
        },
        [onUserSelection, isErrorState],
    );
    const [first, ...rest] = cardsOptions;
    const selectableCardsComponentCommonProps: SelectableCardsProps = {
        cardsOptions,
        onSelect: handleUserSelection,
        selectedItemId: selectedCardId,
        cardClassName: styles.cardStyle,
        containerClassName: classname([
            styles.cardsStyle,
            classIf(styles.upgradeCheckShown, enableUpgradeCheck),
            classIf(styles.error, isErrorState),
        ]),
    };
    const selectableCardsComponentFirstCardProps: SelectableCardsProps = {
        ...selectableCardsComponentCommonProps,
        cardsOptions: [first],
        containerClassName: classname([
            styles.cardsStyle,
            classIf(styles.error, isErrorState),
            styles.firstCardContainer,
        ]),
    };

    const selectableCardsComponentRestProps: SelectableCardsProps = {
        ...selectableCardsComponentCommonProps,
        cardsOptions: rest,
    };

    if (!enableUpgradeCheck) {
        return <SelectableCards {...selectableCardsComponentCommonProps} />;
    }

    return isMobile ? (
        <>
            <SelectableCards {...selectableCardsComponentFirstCardProps} />
            {children}
            <SelectableCards {...selectableCardsComponentRestProps} />
        </>
    ) : (
        <>
            <SelectableCards {...selectableCardsComponentCommonProps} />
            {children}
        </>
    );
};
