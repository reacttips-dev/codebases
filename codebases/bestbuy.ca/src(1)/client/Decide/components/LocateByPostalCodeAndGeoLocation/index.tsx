import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {bindActionCreators} from "redux";
import State from "store";
import {GlobalErrorMessage, ButtonAppearance} from "@bbyca/bbyca-components";

import {
    getUserPreference,
    getUserShippingLocationNearbyStores,
    getUserShippingLocationPostalCode,
} from "store/selectors";
import {PickupStore, Preference} from "models";
import {userActionCreators, UserActionCreators} from "actions";
import * as styles from "./style.css";
import {GeoLocation} from "../GeoLocation";
import PostalCodeSubmit, {MIN_POSTAL_CODE_LENGTH} from "../PostalCodeSubmit";
import {validatePostalCode} from "Decide/utils/validatePostalCode";

export interface OwnProps {
    label?: string;
    helperText?: string;
    placeholder?: string;
    buttonAppearance?: ButtonAppearance;
    ctaText?: string;
    className?: string;
    errorMessage?: string;
    noNearbyStoreMessage?: string;
    enableNoNearbyStoreWarning?: boolean;
    validateCompletePostalCode?: boolean;
    minPostalCodeLength?: number;
    onSubmit?: (isPostalCodeValid: boolean) => void;
}

interface StateProps {
    nearbyStores: PickupStore[];
    preference: Preference | undefined;
    postalCode: string;
}

interface DispatchProps {
    userActions: UserActionCreators;
}
interface RefProps {
    state: {
        value: string;
    };
}

export type LocateByPostalCodeAndGeoLocationProps = OwnProps & StateProps & DispatchProps;

export const LocateByPostalCodeAndGeoLocation: React.FC<LocateByPostalCodeAndGeoLocationProps> = ({
    label,
    helperText,
    placeholder,
    ctaText,
    errorMessage,
    noNearbyStoreMessage,
    userActions,
    nearbyStores,
    preference,
    postalCode,
    enableNoNearbyStoreWarning = true,
    minPostalCodeLength = MIN_POSTAL_CODE_LENGTH,
    validateCompletePostalCode = false,
    onSubmit,
    className,
}) => {
    const inputRef = React.useRef<RefProps>(null);
    const [hasNoNearbyStores, setHasNoNearbyStores] = React.useState(false);

    React.useEffect(() => {
        if (nearbyStores) {
            setHasNoNearbyStores(!nearbyStores.length);
        }
    }, [nearbyStores]);

    React.useEffect(() => {
        if (!nearbyStores?.length) {
            userActions.locate(true);
        }
    }, []);

    const canGeoLocate = () => {
        return !preference || (preference && preference.geoLocation !== "deny");
    };

    const onGeoLocationClicked = () => {
        userActions.locate(true, true, "");
    };

    const onPostalCodeChange = (id: string, value: string, error: boolean) => {
        if (error || !value) {
            setHasNoNearbyStores(false);
            onSubmit?.(error && !value);
        }
    };

    const onPostalCodeSubmit = () => {
        const value = inputRef.current?.state.value || "";
        const isPostalCodeValid = validatePostalCode(value, minPostalCodeLength, validateCompletePostalCode);
        onSubmit?.(isPostalCodeValid);
        if (!isPostalCodeValid) {
            setHasNoNearbyStores(false);
            return;
        }
        userActions.locate(true, false, value);
    };

    return (
        <div className={className}>
            <div className={styles.inputContainer}>
                <PostalCodeSubmit
                    label={label}
                    helperText={helperText}
                    error={false}
                    errorMessage={errorMessage}
                    postalCode={postalCode}
                    placeholder={placeholder}
                    inputRef={inputRef}
                    handlePostalCodeSubmit={onPostalCodeSubmit}
                    ctaText={ctaText}
                    handleSyncChange={onPostalCodeChange}
                    buttonType="button"
                />
                <GeoLocation onGeoLocationClicked={onGeoLocationClicked} isDisabled={!canGeoLocate()} />
            </div>
            {enableNoNearbyStoreWarning && hasNoNearbyStores && <GlobalErrorMessage message={noNearbyStoreMessage} />}
        </div>
    );
};

const mapStateToProps: MapStateToProps<StateProps, {}, State> = (state) => {
    return {
        nearbyStores: getUserShippingLocationNearbyStores(state),
        postalCode: getUserShippingLocationPostalCode(state),
        preference: getUserPreference(state),
    };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (dispatch) => {
    return {
        userActions: bindActionCreators(userActionCreators, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LocateByPostalCodeAndGeoLocation);
