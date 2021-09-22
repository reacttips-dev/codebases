import UnlockModalV2Container from "components/React/UnlockModalContainer/UnlockModalV2Container";
import { FC } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { Injector } from "common/ioc/Injector";
import Field from "./Field";
import { trackCampaignVisit } from "./tileTrack";
import { IconButton } from "@similarweb/ui-components/dist/button";
import styled from "styled-components";

const LinkOutContainer = styled.div`
    position: relative;
    margin-left: 10px;
`;

const fieldTranslationMap = () => {
    const i18nFilter = Injector.get("i18nFilter");

    const res: any = {
        FirstDetected: {
            title: i18nFilter("First seen"),
            format: (date) => dayjs(date).format("YYYY-MM-DD"),
        },
        LastDetected: {
            title: i18nFilter("Last seen"),
            format: (date) => dayjs(date).format("YYYY-MM-DD"),
        },
        ActiveDays: {
            title: i18nFilter("Active days"),
            format: (val) => val,
        },

        Size: {
            title: i18nFilter("Size"),
            format: (val) => val,
        },
    };

    return res;
};

const TileDetails: FC<any> = ({ item, locked }) => {
    const fieldsDetails = fieldTranslationMap();

    return (
        <div className="tile-details">
            <div className="tile-fields-details">
                {Object.entries(fieldsDetails).map(([field, fieldDetails]) =>
                    item[field] != undefined ? (
                        <Field key={field} {...fieldDetails} field={field} value={item[field]} />
                    ) : null,
                )}
            </div>
            <LinkOutContainer>
                {locked && (
                    <UnlockModalV2Container
                        className="tile-locked-link"
                        isLink={true}
                        buttonText=""
                        modalConfig={{
                            featureKey: "GetMoreResults",
                            trackingSubName: "creatives",
                        }}
                    />
                )}
                <IconButton
                    type="flat"
                    onClick={
                        locked
                            ? undefined
                            : () => {
                                  trackCampaignVisit(item.CampaignUrl);
                                  window.open(item.CampaignUrl);
                              }
                    }
                    iconName="link-out"
                />
            </LinkOutContainer>
        </div>
    );
};

TileDetails.propTypes = {
    item: PropTypes.shape({
        FirstDetected: PropTypes.string.isRequired,
        LastDetected: PropTypes.string.isRequired,
        ActiveDays: PropTypes.number.isRequired,
        Size: PropTypes.string.isRequired,
    }),
    locked: PropTypes.bool,
};

export default TileDetails;
